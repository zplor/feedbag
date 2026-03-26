import type { FileNode } from "~/types";

// 递归解析文件系统入口
export async function parseFileEntry(
	handle: FileSystemDirectoryHandle,
	path: string = "",
): Promise<FileNode[]> {
	const nodes: FileNode[] = [];

	// TypeScript type definition issue: FileSystemDirectoryHandle.entries() is not in the lib
	const handleWithEntries = handle as any;
	for await (const [name, entry] of handleWithEntries.entries()) {
		const entryPath = path ? `${path}/${name}` : name;

		if (entry.kind === "file") {
			const fileHandle = entry as FileSystemFileHandle;
			const file = await fileHandle.getFile();
			const extension = name.includes(".") ? name.split(".").pop() : undefined;

			nodes.push({
				id: entryPath,
				name,
				path: entryPath,
				type: "file",
				extension,
				size: file.size,
				handle: fileHandle,
				checked: false,
			});
		} else if (entry.kind === "directory") {
			const dirHandle = entry as FileSystemDirectoryHandle;
			const children = await parseFileEntry(dirHandle, entryPath);

			nodes.push({
				id: entryPath,
				name,
				path: entryPath,
				type: "folder",
				children,
				handle: dirHandle,
			});
		}
	}

	return nodes;
}

// 统计文件数量
export function countFiles(nodes: FileNode[]): number {
	let count = 0;
	for (const node of nodes) {
		if (node.type === "file") {
			count++;
		} else if (node.children) {
			count += countFiles(node.children);
		}
	}
	return count;
}

// 粗略估算 token 数量（字符数 ÷ 4）
export function countTokens(text: string): number {
	return Math.ceil(text.length / 4);
}

// 读取文件内容
export async function readFileContent(handle: FileSystemFileHandle): Promise<string> {
	const file = await handle.getFile();
	return file.text();
}

// 根据文件名获取语言
export function getLanguageFromFilename(filename: string): string {
	const ext = filename.includes(".") ? filename.split(".").pop()?.toLowerCase() : "";

	const languageMap: Record<string, string> = {
		js: "javascript",
		jsx: "javascript",
		ts: "typescript",
		tsx: "typescript",
		py: "python",
		rb: "ruby",
		go: "go",
		rs: "rust",
		java: "java",
		c: "c",
		cpp: "cpp",
		h: "c",
		cs: "csharp",
		php: "php",
		scala: "scala",
		kt: "kotlin",
		swift: "swift",
		objc: "objective-c",
		sh: "shell",
		bash: "shell",
		zsh: "shell",
		powershell: "powershell",
		ps1: "powershell",
		sql: "sql",
		html: "html",
		htm: "html",
		xml: "xml",
		svg: "svg",
		css: "css",
		scss: "scss",
		sass: "sass",
		less: "less",
		json: "json",
		yaml: "yaml",
		yml: "yaml",
		toml: "toml",
		ini: "ini",
		md: "markdown",
		markdown: "markdown",
		txt: "text",
		dockerfile: "dockerfile",
		docker: "dockerfile",
		makefile: "makefile",
	};

	return languageMap[ext || ""] || "text";
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0B";

	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${(bytes / k ** i).toFixed(1)}${sizes[i]}`;
}
