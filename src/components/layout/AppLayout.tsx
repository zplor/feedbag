import type React from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { type ClipboardFile, formatClipboardOutput } from "~/lib/formatter";
import { useWorkspaceStore } from "~/store/workspace";
import type { FileNode, Pack } from "~/types";
import {
	countTokens,
	getLanguageFromFilename,
	readFileContent,
} from "~/utils/fileUtils";
import { LanguageSwitchButton } from "../language-switch";
import { Toast } from "../ui/Toast";

const Footer: React.FC = memo(() => {
	const { t } = useTranslation();
	const effectiveCreditsText = t("layout.footer.credits");
	const effectiveDirectoryTreeText = t("layout.footer.directoryTree");
	const effectiveFileHeadersText = t("layout.footer.fileHeaders");
	const effectiveCopyText = t("layout.footer.copyToClipboard");

	const {
		packs,
		currentPackId,
		openFiles,
		activeFileId,
		getCurrentFileTree,
		outputIncludeTree,
		outputIncludeFileHeaders,
		toggleOutputIncludeTree,
		toggleOutputIncludeFileHeaders,
		ignorePatternsText,
		setIgnorePatternsText,
	} = useWorkspaceStore();

	const currentPack = useMemo(() => {
		if (!Array.isArray(packs)) return undefined;
		return packs.find((p: Pack) => p.id === currentPackId);
	}, [packs, currentPackId]);

	const [isCopying, setIsCopying] = useState(false);
	const [copyToast, setCopyToast] = useState<string | null>(null);
	const [copyToastTone, setCopyToastTone] = useState<"success" | "error">(
		"success",
	);
	const copyToastTimerRef = useRef<number | null>(null);

	// Ignore pattern settings modal
	const [isIgnoreModalOpen, setIsIgnoreModalOpen] = useState(false);
	const [ignoreDraft, setIgnoreDraft] = useState(ignorePatternsText);
	const ignoreModalRef = useRef<HTMLDivElement>(null);
	const ignoreButtonRef = useRef<HTMLButtonElement>(null);
	const [ignoreModalPos, setIgnoreModalPos] = useState<{
		left: number;
		top: number;
	} | null>(null);

	useEffect(() => {
		if (!isIgnoreModalOpen) return;
		setIgnoreDraft(ignorePatternsText);
	}, [ignorePatternsText, isIgnoreModalOpen]);

	useEffect(() => {
		if (!isIgnoreModalOpen) return;

		// EN: Position modal under the settings button.
		const btn = ignoreButtonRef.current;
		if (btn) {
			const rect = btn.getBoundingClientRect();
			const modalWidth = 480;
			const modalHeight = 320; // EN: estimated height for this modal
			const padding = 16;
			const centerLeft = rect.left + rect.width / 2;
			const desiredLeft = centerLeft - modalWidth / 2;
			const minLeft = padding;
			const maxLeft = window.innerWidth - modalWidth - padding;
			const safeLeft = Math.min(maxLeft, Math.max(minLeft, desiredLeft));

			const desiredTopBelow = rect.bottom + 10;
			const maxTop = window.innerHeight - modalHeight - padding;
			let safeTop = desiredTopBelow;
			if (desiredTopBelow > maxTop) {
				// EN: If it doesn't fit below, show above.
				safeTop = rect.top - modalHeight - 10;
			}
			safeTop = Math.min(maxTop, Math.max(padding, safeTop));
			setIgnoreModalPos({ left: safeLeft, top: safeTop });
		}

		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node | null;
			if (!target) return;
			if (ignoreModalRef.current && !ignoreModalRef.current.contains(target)) {
				setIsIgnoreModalOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isIgnoreModalOpen]);

	const openIgnoreModal = useCallback(() => {
		const btn = ignoreButtonRef.current;
		if (btn) {
			const rect = btn.getBoundingClientRect();
			const modalWidth = 480;
			const modalHeight = 320; // EN: estimated height for this modal
			const padding = 16;
			const centerLeft = rect.left + rect.width / 2;
			const desiredLeft = centerLeft - modalWidth / 2;
			const minLeft = padding;
			const maxLeft = window.innerWidth - modalWidth - padding;
			const safeLeft = Math.min(maxLeft, Math.max(minLeft, desiredLeft));
			const desiredTopBelow = rect.bottom + 10;
			const maxTop = window.innerHeight - modalHeight - padding;
			let safeTop = desiredTopBelow;
			if (desiredTopBelow > maxTop) {
				safeTop = rect.top - modalHeight - 10;
			}
			safeTop = Math.min(maxTop, Math.max(padding, safeTop));
			setIgnoreModalPos({ left: safeLeft, top: safeTop });
		}
		setIsIgnoreModalOpen(true);
	}, []);

	const collectCheckedFileNodes = useCallback(
		(tree: FileNode[] | undefined) => {
			const selected: FileNode[] = [];
			if (!Array.isArray(tree) || tree.length === 0) return selected;

			const visit = (nodes: FileNode[]) => {
				for (const node of nodes) {
					if (!node) continue;

					if (node.type === "file" && node.checked) {
						selected.push(node);
					}

					if (Array.isArray(node.children) && node.children.length > 0) {
						visit(node.children);
					}
				}
			};

			visit(tree);
			return selected;
		},
		[],
	);

	const writeTextToClipboard = useCallback(async (text: string) => {
		if (!text) return;

		// EN: Use async Clipboard API first
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
			return;
		}

		// EN: Fallback for older browsers
		const textarea = document.createElement("textarea");
		textarea.value = text;
		textarea.setAttribute("readonly", "true");
		textarea.style.position = "fixed";
		textarea.style.top = "-1000px";
		textarea.style.left = "-1000px";
		document.body.appendChild(textarea);
		textarea.select();
		const ok = document.execCommand("copy");
		document.body.removeChild(textarea);
		if (!ok) throw new Error("Clipboard copy failed");
	}, []);

	const handleCopy = useCallback(async () => {
		if (isCopying) return;

		const pack = currentPack;
		if (!pack) {
			setCopyToastTone("error");
			setCopyToast(t("workspace.toast.importPackFirst"));

			if (copyToastTimerRef.current) {
				window.clearTimeout(copyToastTimerRef.current);
			}
			copyToastTimerRef.current = window.setTimeout(() => {
				setCopyToast(null);
				copyToastTimerRef.current = null;
			}, 2000);
			return;
		}

		try {
			const visibleFileTree = getCurrentFileTree();
			const checkedNodes = collectCheckedFileNodes(visibleFileTree);
			const isSingleFilePack =
				pack?.handle === null &&
				(!Array.isArray(pack?.fileTree) || pack?.fileTree.length === 0);

			if (checkedNodes.length === 0) {
				if (!isSingleFilePack) {
					setCopyToastTone("error");
					setCopyToast(t("workspace.toast.selectFilesFirst"));

					if (copyToastTimerRef.current) {
						window.clearTimeout(copyToastTimerRef.current);
					}
					copyToastTimerRef.current = window.setTimeout(() => {
						setCopyToast(null);
						copyToastTimerRef.current = null;
					}, 2000);
					return;
				}

				// EN: Single-file pack fallback
				const active = (openFiles ?? []).find((f) => f.id === activeFileId);
				const fallback = active ? [active] : (openFiles ?? []);
				if (fallback.length === 0) {
					setCopyToastTone("error");
					setCopyToast(t("workspace.toast.selectFilesFirst"));
					return;
				}

				setIsCopying(true);

				const selectedFiles: ClipboardFile[] = [];
				let copiedTokens = 0;
				for (const file of fallback) {
					if (!file?.path || !file?.name) continue;
					const content = file.content ?? "";
					copiedTokens += countTokens(content);
					selectedFiles.push({
						relativePath: file.path,
						name: file.name,
						language: file.language ?? getLanguageFromFilename(file.name),
						content,
					});
				}

				const output = formatClipboardOutput({
					context: pack?.context ?? "",
					packName: pack?.name ?? "",
					includeTree: outputIncludeTree,
					includeFileHeaders: outputIncludeFileHeaders,
					files: selectedFiles,
				});

				await writeTextToClipboard(output);

				setCopyToastTone("success");
				setCopyToast(
					t("workspace.toast.copySuccessWithTokens", { count: copiedTokens }),
				);

				if (copyToastTimerRef.current) {
					window.clearTimeout(copyToastTimerRef.current);
				}
				copyToastTimerRef.current = window.setTimeout(() => {
					setCopyToast(null);
					copyToastTimerRef.current = null;
				}, 2000);

				return;
			}

			setIsCopying(true);

			const openFileByPath = new Map((openFiles ?? []).map((f) => [f.path, f]));

			const selectedFiles: ClipboardFile[] = [];
			let copiedTokens = 0;

			for (const node of checkedNodes) {
				const existing = openFileByPath.get(node.path);

				if (!node.name || !node.path) continue;

				const language =
					existing?.language ?? getLanguageFromFilename(node.name ?? "");

				let content = existing?.content;
				if (content === undefined) {
					if (!node.handle) continue;
					content = await readFileContent(node.handle as FileSystemFileHandle);
				}

				copiedTokens += countTokens(content ?? "");
				selectedFiles.push({
					relativePath: node.path,
					name: node.name,
					language,
					content: content ?? "",
				});
			}

			const output = formatClipboardOutput({
				context: pack?.context ?? "",
				packName: pack?.name ?? "",
				includeTree: outputIncludeTree,
				includeFileHeaders: outputIncludeFileHeaders,
				files: selectedFiles,
			});

			await writeTextToClipboard(output);

			setCopyToastTone("success");
			setCopyToast(
				t("workspace.toast.copySuccessWithTokens", { count: copiedTokens }),
			);
			if (copyToastTimerRef.current) {
				window.clearTimeout(copyToastTimerRef.current);
			}
			copyToastTimerRef.current = window.setTimeout(() => {
				setCopyToast(null);
				copyToastTimerRef.current = null;
			}, 2000);
		} catch (error) {
			console.error("Copy to clipboard failed:", error);
		} finally {
			setIsCopying(false);
		}
	}, [
		collectCheckedFileNodes,
		currentPack,
		activeFileId,
		isCopying,
		openFiles,
		outputIncludeFileHeaders,
		outputIncludeTree,
		getCurrentFileTree,
		writeTextToClipboard,
	]);

	return (
		<footer className="relative bg-[#2D3B2D] text-white flex justify-between items-center px-6 h-12 z-50">
			<div className="flex gap-4">
				<span className="font-mono text-[10px] tracking-widest text-white/60">
					{effectiveCreditsText}
				</span>
			</div>
			<div className="flex items-center gap-8">
				<div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-white/80">
					<button
						type="button"
						className={`transition-colors flex items-center gap-2 px-2 py-1 rounded ${
							outputIncludeTree
								? "text-[#8FAF6E]"
								: "hover:text-[#8FAF6E] text-white/60"
						}`}
						onClick={toggleOutputIncludeTree}
					>
						<span className="material-symbols-outlined text-[14px]">
							{outputIncludeTree ? "toggle_on" : "toggle_off"}
						</span>
						{effectiveDirectoryTreeText}
					</button>
					<button
						type="button"
						className={`transition-colors flex items-center gap-2 px-2 py-1 rounded ${
							outputIncludeFileHeaders
								? "text-[#8FAF6E]"
								: "hover:text-[#8FAF6E] text-white/60"
						}`}
						onClick={toggleOutputIncludeFileHeaders}
					>
						<span className="material-symbols-outlined text-[14px]">
							{outputIncludeFileHeaders ? "toggle_on" : "toggle_off"}
						</span>
						{effectiveFileHeadersText}
					</button>
				</div>
				<div className="relative">
					<button
						type="button"
						ref={ignoreButtonRef}
						className="hover:text-[#8FAF6E] transition-colors flex items-center gap-2 px-2 py-1 rounded text-[10px] font-mono uppercase tracking-widest"
						onClick={openIgnoreModal}
					>
						<span className="material-symbols-outlined text-[14px]">
							settings
						</span>
						{t("workspace.ignoreSettings.button")}
					</button>

					{isIgnoreModalOpen && (
						<div
							ref={ignoreModalRef}
							className="context-modal fixed w-[480px] bg-white border border-[#C8C6BE] shadow-2xl p-6 z-[80] rounded-xl pointer-events-auto text-[#1b1c18]"
							style={
								ignoreModalPos
									? {
											left: `${ignoreModalPos.left}px`,
											top: `${ignoreModalPos.top}px`,
										}
									: { left: "16px", top: "16px" }
							}
						>
							<label
								htmlFor="ignore-patterns-textarea"
								className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block mb-3"
							>
								{t("workspace.ignoreSettings.modalTitle")}
							</label>
							<textarea
								id="ignore-patterns-textarea"
								value={ignoreDraft}
								onChange={(e) => setIgnoreDraft(e.target.value)}
								className="w-full h-44 bg-[#fbf9f3] border border-outline-variant/30 outline-0 focus:ring-2 focus:ring-[#8FAF6E]/30 font-body text-sm p-4 resize-none text-[#1b1c18] placeholder:italic placeholder:text-on-surface-variant/30 mb-4 rounded-lg"
								placeholder={t("workspace.ignoreSettings.placeholder")}
							/>
							<div className="flex justify-end gap-3">
								<button
									type="button"
									className="bg-white text-on-surface-variant font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-[#C8C6BE] hover:bg-surface-container-lowest transition-colors rounded-lg"
									onClick={() => setIsIgnoreModalOpen(false)}
								>
									{t("workspace.ignoreSettings.cancelButton")}
								</button>
								<button
									type="button"
									className="bg-[#8FAF6E] text-white font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2 hover:bg-[#7e9c5f] rounded-lg transition-colors"
									onClick={() => {
										setIgnorePatternsText(ignoreDraft);
										setIsIgnoreModalOpen(false);
									}}
								>
									{t("workspace.ignoreSettings.saveButton")}
								</button>
							</div>
						</div>
					)}
				</div>
				<button
					type="button"
					className={`${
						isCopying
							? "bg-[#8FAF6E]/60 hover:bg-[#8FAF6E]/60 cursor-not-allowed"
							: "bg-[#8FAF6E] hover:bg-[#a1bf82]"
					} text-[#111F12] font-mono text-[10px] font-bold uppercase tracking-widest px-4 h-8 flex items-center gap-2 transition-all rounded-lg`}
					onClick={handleCopy}
					disabled={isCopying}
				>
					<span className="material-symbols-outlined text-[16px]">
						content_copy
					</span>
					{effectiveCopyText}
				</button>
			</div>

			{copyToast && (
				<div className="fixed left-1/2 top-16 -translate-x-1/2 z-[70] pointer-events-none">
					<Toast
						message={copyToast}
						className={`font-mono font-bold shadow-2xl border ${
							copyToastTone === "success"
								? "bg-[#8FAF6E] text-white border-white/10"
								: "bg-[#ba1a1a] text-white border-white/10"
						}`}
					/>
				</div>
			)}
		</footer>
	);
});

const Header: React.FC = memo(() => {
	const { t } = useTranslation();
	const effectiveLogoText = t("layout.header.logo");
	const effectiveExplorerText = t("layout.header.explorer");
	const effectiveGithubText = t("layout.header.github");

	return (
		<header className="bg-[#2D3B2D] dark:bg-[#1b241b] text-[#ECEAE4] flex justify-between items-center w-full px-6 h-14 z-50 transition-colors duration-200">
			<div className="flex items-center gap-8">
				<NavLink to="/" className="flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						stroke="#9AA89A"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						fill="#8FAF6E"
					>
						<title>{effectiveLogoText}</title>
						<path d="M14 4.1 12 6" />
						<path d="m5.1 8-2.9-.8" />
						<path d="m6 12-1.9 2" />
						<path d="M7.2 2.2 8 5.1" />
						<path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" />
					</svg>
					<span className="text-xl font-mono font-bold text-[#ECEAE4] dark:text-[#fbf9f3]">
						{effectiveLogoText}
					</span>
				</NavLink>
				<nav className="hidden md:flex items-center">
					<div className="h-6 w-[1px] bg-[#ECEAE4]/20 mx-2" />
					<a
						className="font-mono font-bold text-[10px] tracking-[0.2em] text-[#8FAF6E] px-4 py-1"
						href="/app"
					>
						{effectiveExplorerText}
					</a>
				</nav>
			</div>
			<div className="flex items-center gap-6">
				<LanguageSwitchButton />
				{/* GitHub Link */}
				<a
					className="text-[#8FAF6E] font-bold font-mono text-sm tracking-widest uppercase items-center gap-1.5"
					href="https://github.com/zplor/feedbag"
					target="_blank"
					rel="noopener noreferrer"
				>
					{/* GitHub Icon */}
					<svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
						<title>{effectiveGithubText}</title>
						<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
					</svg>
				</a>
				<a
					href="https://github.com/zplor/feedbag/issues"
					target="_blank"
					rel="noopener noreferrer"
					className="bg-[#536252] text-[#ECEAE4] px-5 py-2 font-mono text-sm tracking-widest uppercase hover:bg-[#8FAF6E] transition-all duration-200 rounded-arboreal hover:shadow-md"
				>
					{t("layout.header.feedback")}
				</a>
			</div>
		</header>
	);
});

export interface AppLayoutProps {
	children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = memo(({ children }) => {
	return (
		<div className="bg-background text-on-surface font-body overflow-hidden h-screen flex flex-col">
			<Header />
			<main className="flex-1 flex overflow-hidden">{children}</main>
			<Footer />
		</div>
	);
});

AppLayout.displayName = "AppLayout";
