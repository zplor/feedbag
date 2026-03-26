// 文件树节点类型
export interface FileNode {
	id: string;
	name: string;
	path: string;
	type: "file" | "folder";
	extension?: string;
	size?: number;
	handle?: FileSystemFileHandle | FileSystemDirectoryHandle;
	children?: FileNode[];
	checked?: boolean;
}

// 打开的文件类型
export interface OpenFile {
	id: string;
	name: string;
	path: string;
	content: string;
	language: string;
}

// Pack 类型
export interface Pack {
	id: string;
	name: string;
	path: string;
	fileCount: number;
	tokenCount: number;
	handle: FileSystemDirectoryHandle | null;
	fileTree: FileNode[];
	context: string;
}

// 输出配置类型
export interface OutputOptions {
	includeTree: boolean;
	includeFilePath: boolean;
	separatorFormat: string;
	maxFileSizeKB: number;
}

// 输出结果类型
export interface OutputResult {
	content: string;
	fileCount: number;
	estimatedTokens: number;
	skippedFiles: string[];
}

