import type React from "react";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import {
	AppLayout,
	CodeEditor,
	ContextBar,
	FileTabs,
	FileTree,
} from "~/components";
import { useWorkspaceStore } from "~/store/workspace";
import type { FileNode, OpenFile, Pack } from "~/types";
import {
	countFiles,
	countTokens,
	getLanguageFromFilename,
	parseFileEntry,
	readFileContent,
} from "~/utils/fileUtils";

const WorkspacePage: React.FC = memo(() => {
	const { t } = useTranslation();
	const {
		packs,
		currentPackId,
		addPack,
		setCurrentPack,
		getCurrentFileTree,
		openFiles,
		openFile,
		setActiveFile,
		isEmptyData,
		setEmptyData,
	} = useWorkspaceStore();

	const currentFileTree = getCurrentFileTree();

	// EN: Token estimation for total/selected files in the tree.
	// 仅基于文件大小做粗略估算（与现有 token 估算策略一致）。
	const { totalTokens, selectedTokens } = useMemo(() => {
		const tree = currentFileTree ?? [];

		const walk = (nodes: FileNode[]): { total: number; selected: number } => {
			let totalAcc = 0;
			let selectedAcc = 0;

			for (const node of nodes) {
				if (!node) continue;

				if (node.type === "file" && node.size) {
					const token = Math.ceil(node.size / 4);
					totalAcc += token;
					if (node.checked) {
						selectedAcc += token;
					}
				}

				if (Array.isArray(node.children) && node.children.length > 0) {
					const child = walk(node.children);
					totalAcc += child.total;
					selectedAcc += child.selected;
				}
			}

			return { total: totalAcc, selected: selectedAcc };
		};

		const res = walk(tree);
		return { totalTokens: res.total, selectedTokens: res.selected };
	}, [currentFileTree]);

	const dropZoneRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isAddPackLoading, setIsAddPackLoading] = useState(false);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "copy";
	}, []);

	const handleDrop = useCallback(async (e: React.DragEvent) => {
		e.preventDefault();
		const items = e.dataTransfer.items;

		// Prefer File System Access API handles when available.
		let handledAny = false;
		const itemList = Array.from(items ?? []);
		for (const item of itemList) {
			try {
				// EN: FS Access API handles
				const getAsFileSystemHandle = (item as any).getAsFileSystemHandle as
					| undefined
					| (() => Promise<FileSystemHandle>);
				if (typeof getAsFileSystemHandle === "function") {
					// EN: call it directly from the item to keep correct binding.
					const handle = await (item as any).getAsFileSystemHandle();
					if (handle.kind === "directory") {
						handledAny = true;
						await addFolder(handle as FileSystemDirectoryHandle);
						continue;
					}
					if (handle.kind === "file") {
						handledAny = true;
						const file = await (handle as FileSystemFileHandle).getFile();
						await addSingleFile(file);
						continue;
					}
				}

				// EN: Fallback for file entries (no directory tree reconstruction)
				const fileFallback =
					item.kind === "file" && typeof (item as any).getAsFile === "function"
						? await (item as any).getAsFile()
						: null;
				if (fileFallback) {
					handledAny = true;
					await addSingleFile(fileFallback);
				}
			} catch (error) {
				// EN: If handle extraction fails (e.g. Illegal invocation), keep trying other items.
			}
		}

		// Fallback: if handles are not available, use DataTransfer.files (files only).
		if (!handledAny) {
			const droppedFiles = Array.from(e.dataTransfer.files ?? []);
			for (const file of droppedFiles) {
				await addSingleFile(file);
			}
		}
	}, []);

	const handleBrowse = useCallback(async () => {
		// EN: Prefer File System Access API for folders/files.
		const anyWindow = window as any;

		const showDirectoryPicker = anyWindow.showDirectoryPicker as
			| undefined
			| (() => Promise<FileSystemDirectoryHandle>);
		const showOpenFilePicker = anyWindow.showOpenFilePicker as
			| undefined
			| ((options?: any) => Promise<FileSystemFileHandle[]>);

		try {
			if (showDirectoryPicker) {
				const handle = await showDirectoryPicker();
				if (handle) {
					await addFolder(handle as FileSystemDirectoryHandle);
					return;
				}
			}
		} catch (error) {
			// EN: If directory picker is canceled/unsupported, try file picker next.
			// Keep silent to avoid confusing users.
		}

		try {
			if (showOpenFilePicker) {
				const handles = await showOpenFilePicker({ multiple: false });
				const fileHandle = handles?.[0];
				if (fileHandle) {
					const file = await fileHandle.getFile();
					await addSingleFile(file);
					return;
				}
			}
		} catch (error) {
			// EN: fallback to the legacy input below
		}

		// Legacy fallback: file input only.
		fileInputRef.current?.click();
	}, []);

	const handleFileInputChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (files && files.length > 0) {
				const file = files[0];
				if (!file) return;

				// Handle single file
				await addSingleFile(file);
			}

			// Reset input
			if (e.target) {
				e.target.value = "";
			}
		},
		[],
	);

	const addFolder = async (handle: FileSystemDirectoryHandle) => {
		try {
			const nodes = await parseFileEntry(handle);
			const fileCount = countFiles(nodes);

			// Calculate total tokens (estimate based on file sizes)
			let totalSize = 0;
			const countSize = (tree: FileNode[]) => {
				for (const node of tree) {
					if (node.type === "file" && node.size) {
						totalSize += node.size;
					} else if (node.children) {
						countSize(node.children);
					}
				}
			};
			countSize(nodes);
			const tokenCount = countTokens("X".repeat(Math.floor(totalSize / 4)));

			const pack: Pack = {
				id: uuidv4(),
				name: handle.name,
				path: handle.name,
				fileCount,
				tokenCount,
				context: "",
				handle,
				fileTree: nodes,
			};

			addPack(pack);
			setEmptyData(false);
		} catch (error) {
			console.error("Error adding folder:", error);
			alert("Failed to load folder. Please try again.");
		}
	};

	const addSingleFile = async (file: File) => {
		try {
			const content = await file.text();
			const language = getLanguageFromFilename(file.name);

			const openFileData: OpenFile = {
				id: uuidv4(),
				name: file.name,
				path: file.name,
				content,
				language,
			};

			// Create a virtual pack
			const pack: Pack = {
				id: uuidv4(),
				name: file.name,
				path: file.name,
				fileCount: 1,
				tokenCount: countTokens(content),
				context: "",
				handle: null, // Not needed for single file
				fileTree: [],
			};

			addPack(pack);
			setEmptyData(false);

			// Open file immediately
			openFile(openFileData);
		} catch (error) {
			console.error("Error reading file:", error);
			alert("Failed to read file. Please try again.");
		}
	};

	const handleFileClick = useCallback(
		async (node: FileNode) => {
			if (node.type === "file" && node.handle) {
				// Check if file is already open
				const existingFile = openFiles.find((f) => f.path === node.path);
				if (existingFile) {
					setActiveFile(existingFile.id);
					return;
				}

				try {
					const content = await readFileContent(
						node.handle as FileSystemFileHandle,
					);
					const language = getLanguageFromFilename(node.name);

					const openFileData: OpenFile = {
						id: uuidv4(),
						name: node.name,
						path: node.path,
						content,
						language,
					};

					openFile(openFileData);
				} catch (error) {
					console.error("Error reading file:", error);
					alert("Failed to read file. Please try again.");
				}
			}
		},
		[openFiles, setActiveFile],
	);

	const handleAddPack = useCallback(async () => {
		if (isAddPackLoading) return;
		try {
			const handle = await (window as any).showDirectoryPicker();
			if (handle) {
				setIsAddPackLoading(true);
				await addFolder(handle);
			}
		} catch (error) {
			console.error("Error opening directory picker:", error);
		} finally {
			setIsAddPackLoading(false);
		}
	}, [addFolder, isAddPackLoading]);

	const handlePackClick = useCallback(
		(packId: string) => {
			if (currentPackId === packId) {
				return;
			}
			setCurrentPack(packId);
		},
		[currentPackId, setCurrentPack],
	);

	return (
		<AppLayout>
			{/* Left Sidebar: Packs */}
			<aside className="w-64 flex-shrink-0 bg-surface-container-low border-r border-outline-variant/20 flex flex-col">
				<div className="p-6">
					<div className="flex justify-between items-baseline mb-6">
						<h2 className="text-[10px] font-bold uppercase text tracking-widest text-on-surface-variant">
							{t("workspace.sidebar.title")}
						</h2>
						<span className="text-[9px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
							v1.0.0-STABLE
						</span>
					</div>
					<div className="space-y-2">
						{packs.map((pack) => (
							<button
								key={pack.id}
								type="button"
								className={`group relative w-full text-left p-3 transition-all duration-200 cursor-pointer rounded-r-lg border-l-4 ${
									currentPackId === pack.id
										? "bg-[#ECEAE4] border-secondary"
										: "hover:bg-surface-container-highest/50 border-transparent"
								}`}
								onClick={() => handlePackClick(pack.id)}
							>
								<div className="flex justify-between items-center">
									<span
										className={`text-xs ${
											currentPackId === pack.id
												? "font font-bold text-primary"
												: "font-medium text-on-surface-variant"
										}`}
									>
										{pack.name}
									</span>
									<span className="material-symbols-outlined opacity-0 group-hover:opacity-100 text-on-surface-variant text-[16px] hover:text-primary transition-opacity">
										settings
									</span>
								</div>
								<div
									className={`text-[10px] mt-1 font-mari font-mono ${
										currentPackId === pack.id
											? "text-on-surface-variant"
											: "text-on-surface-variant/60"
									}`}
								>
									{t("workspace.pack.filesCount", { count: pack.fileCount })}
								</div>
							</button>
						))}
						{packs.length === 0 && (
							<div className="text-center text-on-surface-variant/50 text-xs py-4">
								{t("workspace.sidebar.noPacksYet")}
							</div>
						)}
					</div>
				</div>
				<div className="mt-auto p-6">
					<button
						type="button"
						disabled={isAddPackLoading}
						className="w-full flex items-center justify-center gap-2 py-3 bg-[#2D3B2D] text-white rounded-lg hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
						onClick={handleAddPack}
					>
						{isAddPackLoading ? (
							<span className="material-symbols-outlined text-sm animate-spin">
								autorenew
							</span>
						) : (
							<span className="material-symbols-outlined text-sm">add</span>
						)}
						<span className="text-sm font-bold tracking-tight">
							{isAddPackLoading
								? t("workspace.sidebar.addPackLoading")
								: t("workspace.sidebar.addPackButton")}
						</span>
					</button>
				</div>
			</aside>

			{/* Middle Column: File Tree */}
			{!isEmptyData && (
				<section className="w-80 flex-shrink-0 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col">
					<div className="p-4 border-b border-outline-variant/10 flex justify-between items-center">
						<span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
							{t("workspace.fileTree.title")}
						</span>
						<div className="flex items-center gap-3">
							<span className="text-[10px] font-mono">
								<span className="font-bold text-[#8FAF6E]">
									{selectedTokens}
								</span>
								<span className="text-on-surface-variant/50">
									/{totalTokens} {t("workspace.fileTree.tokensSuffix")}
								</span>
							</span>
						</div>
					</div>
					<div className="flex-grow overflow-y-auto p-2">
						<FileTree nodes={currentFileTree} onFileClick={handleFileClick} />
					</div>
				</section>
			)}

			{/* Right Content Area */}
			<div
				ref={dropZoneRef}
				className={`flex-1 flex flex flex-col bg-background overflow-hidden ${
					isEmptyData ? "drag-active" : ""
				}`}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
			>
				{isEmptyData ? (
					/* Empty Data View */
					<div className="flex-1 flex flex-col items-center justify-center p-12 bg-[#F6F4F0]/30">
						<button
							type="button"
							className="w-[480px] h-[320px] custom-dashed bg-[#F5F4F0] rounded-lg flex flex-col items-center justify-center group cursor-pointer hover:bg-white transition-colors duration-300"
							onClick={handleBrowse}
						>
							<div className="mb-6 relative">
								<div className="w-20 h-20 bg-secondary-container/30 rounded-2xl flex items-center justify-center text-on-secondary-container">
									<span
										className="material-symbols-outlined text-5xl"
										style={{ fontVariationSettings: "'FILL' 1" }}
									>
										folder
									</span>
								</div>
								<div className="absolute -bottom-1 -right-1 bg-primary w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#F5F4F0] group-hover:border-white transition-colors">
									<span className="text-white text-base text-[16px]">↓</span>
								</div>
							</div>
							<h1 className="text-2xl font-black text-on-surface tracking-tight mb-2">
								{t("workspace.emptyState.dropFolderTitle")}
							</h1>
							<p className="text-on-surface-variant font-medium text-sm mb-8">
								{t("workspace.emptyState.browseSubtitle")}
							</p>
							<div className="flex items-center gap-3 px-4 py-2 bg-surface-container-lowest rounded-full">
								<span className="material-symbols-outlined text-on-secondary-fixed-variant text-sm">
									security
								</span>
								<p className="text-[11px] text-on-secondary-fixed-variant font-semibold tracking-tight uppercase">
									{t("workspace.emptyState.supportText")}
								</p>
							</div>
						</button>
						{/* Contextual Hint */}
						<div className="mt-12 max-w-sm text-center">
							<div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-surface-container-highest/50 rounded-lg">
								<span className="material-symbols-outlined text-sm">info</span>
								<span className="text-[10px] font-bold uppercase tracking-wider">
									{t("workspace.emptyState.howItWorksTitle")}
								</span>
							</div>
							<p className="text-xs text-on-surface-variant leading-relaxed px-8">
								{t("workspace.emptyState.howItWorksDesc")}
							</p>
						</div>
						{/* Hidden file input for browsing */}
						<input
							ref={fileInputRef}
							type="file"
							className="hidden"
							onChange={handleFileInputChange}
						/>
					</div>
				) : (
					<>
						{/* Context Header Bar */}
						<ContextBar />
						{/* Code Preview Container */}
						<div className="flex-1 flex-shrink-0 flex flex-col overflow-hidden bg-inverse-surface m-4 rounded-xl border border-white/5 shadow-2xl">
							{/* Tab Bar */}
							<FileTabs />
							{/* Code Editor */}
							<CodeEditor />
						</div>
					</>
				)}
			</div>
		</AppLayout>
	);
});

WorkspacePage.displayName = "WorkspacePage";

export default WorkspacePage;
