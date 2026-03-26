import { create } from "zustand";
import {
	DEFAULT_IGNORE_PATTERNS_TEXT,
	filterFileTreeByIgnorePatterns,
} from "~/lib/filters";
import type { FileNode, OpenFile, Pack } from "~/types";

interface WorkspaceState {
	// Packs
	packs: Pack[];
	currentPackId: string | null;
	addPack: (pack: Pack) => void;
	setCurrentPack: (packId: string) => void;
	updatePackContext: (packId: string, context: string) => void;

	// Get current pack and file tree (computed)
	getCurrentPack: () => Pack | undefined;
	getCurrentFileTree: () => FileNode[];

	// Ignore patterns (gitignore-like)
	ignorePatternsText: string;
	setIgnorePatternsText: (text: string) => void;

	// Expanded folders state
	expandedFolders: Set<string>;
	toggleFolder: (path: string) => void;
	toggleFileCheck: (path: string) => void;

	// Open Files
	openFiles: OpenFile[];
	activeFileId: string | null;
	openFile: (file: OpenFile) => void;
	setActiveFile: (fileId: string) => void;
	closeFile: (fileId: string) => void;

	// Empty Data State
	isEmptyData: boolean;
	setEmptyData: (isEmpty: boolean) => void;

	// Output options (clipboard formatting switches)
	outputIncludeTree: boolean;
	outputIncludeFileHeaders: boolean;
	setOutputIncludeTree: (value: boolean) => void;
	setOutputIncludeFileHeaders: (value: boolean) => void;
	toggleOutputIncludeTree: () => void;
	toggleOutputIncludeFileHeaders: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
	// Packs
	packs: [],
	currentPackId: null,
	addPack: (pack) => {
		set((state) => ({
			packs: [...state.packs, pack],
			currentPackId: pack.id,
		}));
	},
	setCurrentPack: (packId) => {
		set({ currentPackId: packId });
	},
	updatePackContext: (packId, context) => {
		set((state) => {
			const updatedPacks = state.packs.map((p) =>
				p.id === packId ? { ...p, context } : p,
			);
			return { packs: updatedPacks };
		});
	},

	// Get current pack and file tree (computed)
	getCurrentPack: () => {
		const state = get();
		return state.packs.find((p) => p.id === state.currentPackId);
	},
	getCurrentFileTree: () => {
		const state = get();
		const pack = state.packs.find((p) => p.id === state.currentPackId);
		const tree = pack?.fileTree ?? [];
		return filterFileTreeByIgnorePatterns(tree, state.ignorePatternsText);
	},

	// Expanded folders state
	expandedFolders: new Set<string>(),
	toggleFolder: (path) => {
		set((state) => {
			const newExpanded = new Set(state.expandedFolders);
			if (newExpanded.has(path)) {
				newExpanded.delete(path);
			} else {
				newExpanded.add(path);
			}
			return { expandedFolders: newExpanded };
		});
	},
	toggleFileCheck: (path) => {
		set((state) => {
			const pack = state.packs.find((p) => p.id === state.currentPackId);
			if (!pack) return state;

			const toggleCheck = (nodes: FileNode[]): FileNode[] => {
				return nodes.map((node) => {
					if (node.path === path) {
						return { ...node, checked: !node.checked };
					}
					if (node.children) {
						return { ...node, children: toggleCheck(node.children) };
					}
					return node;
				});
			};

			const updatedPacks = state.packs.map((p) =>
				p.id === pack.id ? { ...p, fileTree: toggleCheck(p.fileTree) } : p,
			);

			return { packs: updatedPacks };
		});
	},

	// Open Files
	openFiles: [],
	activeFileId: null,
	openFile: (file) => {
		set((state) => {
			const existing = state.openFiles.find((f) => f.id === file.id);
			if (existing) {
				return { activeFileId: file.id };
			}
			return {
				openFiles: [...state.openFiles, file],
				activeFileId: file.id,
			};
		});
	},
	setActiveFile: (fileId) => {
		set({ activeFileId: fileId });
	},
	closeFile: (fileId) => {
		set((state) => {
			const newOpenFiles = state.openFiles.filter((f) => f.id !== fileId);
			const newActiveId =
				state.activeFileId === fileId
					? newOpenFiles.length > 0
						? (newOpenFiles[newOpenFiles.length - 1]?.id ?? null)
						: null
					: state.activeFileId;
			return {
				openFiles: newOpenFiles,
				activeFileId: newActiveId,
			};
		});
	},

	// Empty Data State
	isEmptyData: true,
	setEmptyData: (isEmpty) => {
		set({ isEmptyData: isEmpty });
	},

	// Output options
	outputIncludeTree: true,
	outputIncludeFileHeaders: true,

	ignorePatternsText: DEFAULT_IGNORE_PATTERNS_TEXT,
	setIgnorePatternsText: (text) => {
		set({ ignorePatternsText: text });
	},

	setOutputIncludeTree: (value) => {
		set({ outputIncludeTree: value });
	},
	setOutputIncludeFileHeaders: (value) => {
		set({ outputIncludeFileHeaders: value });
	},
	toggleOutputIncludeTree: () => {
		set((state) => ({ outputIncludeTree: !state.outputIncludeTree }));
	},
	toggleOutputIncludeFileHeaders: () => {
		set((state) => ({
			outputIncludeFileHeaders: !state.outputIncludeFileHeaders,
		}));
	},
}));
