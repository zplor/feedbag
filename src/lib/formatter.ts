export type ClipboardFile = {
	relativePath: string;
	name: string;
	language: string;
	content: string;
};

type DirectoryTrieNode = {
	children: Record<string, DirectoryTrieNode>;
	isFile: boolean;
};

function buildDirectoryTrie(relativePaths: string[]): DirectoryTrieNode {
	// EN: Trie for directory structure
	const root: DirectoryTrieNode = { children: {}, isFile: false };

	for (const relativePath of relativePaths) {
		const safePath = relativePath ?? "";
		if (!safePath) continue;

		const segments = safePath.split("/").filter((s) => s.length > 0);
		if (segments.length === 0) continue;

		let cur = root;
		for (let i = 0; i < segments.length; i++) {
			const seg: any = segments[i];
			const isLeafFile = i === segments.length - 1;
			const existing = cur.children[seg];
			if (!existing) {
				cur.children[seg] = { children: {}, isFile: isLeafFile };
			} else if (isLeafFile) {
				// If inserted again and it's a file, keep isFile=true.
				cur.children[seg] = {
					...existing,
					isFile: true,
				};
			}

			cur = cur.children[seg];
		}
	}

	return root;
}

function buildDirectoryTreeText(
	rootName: string,
	relativePaths: string[],
): string {
	// EN: Render a human-friendly directory tree
	const trie = buildDirectoryTrie(relativePaths);
	const indentUnit = "  ";

	const lines: string[] = [];
	const safeRootName = rootName?.trim() ?? "";
	const renderedRootName = safeRootName.length > 0 ? safeRootName : "project";
	lines.push(`${renderedRootName}/`);

	const walk = (node: DirectoryTrieNode, indentLevel: number) => {
		const keys = Object.keys(node.children ?? {}).sort((a, b) =>
			a.localeCompare(b),
		);
		for (const key of keys) {
			const child = node.children[key];
			if (!child) continue;

			const lineIndent = indentUnit.repeat(indentLevel);
			if (child.isFile) {
				lines.push(`${lineIndent}${key}`);
			} else {
				lines.push(`${lineIndent}${key}/`);
				walk(child, indentLevel + 1);
			}
		}
	};

	walk(trie, 1);
	return lines.join("\n");
}

function buildFullPath(packName: string, relativePath: string): string {
	const safePackName = packName?.trim() ?? "";
	const safeRelativePath = relativePath?.trim() ?? "";
	if (!safePackName) return safeRelativePath;
	if (!safeRelativePath) return safePackName;

	// Avoid `root/root` for single-file packs.
	if (safeRelativePath === safePackName) return safePackName;
	if (safeRelativePath.startsWith(`${safePackName}/`)) return safeRelativePath;

	return `${safePackName}/${safeRelativePath}`;
}

export function formatClipboardOutput(params: {
	context: string;
	packName: string;
	includeTree: boolean;
	includeFileHeaders: boolean;
	files: ClipboardFile[];
}): string {
	const contextText = params.context?.trim() ?? "";
	const files = params.files ?? [];
	const includeTree = Boolean(params.includeTree);
	const includeFileHeaders = Boolean(params.includeFileHeaders);

	const sortedFiles = files
		.slice()
		.sort((a, b) => (a.relativePath ?? "").localeCompare(b.relativePath ?? ""));

	const parts: string[] = [];

	if (contextText) {
		parts.push(`Project Context:\n${contextText}`);
	}

	if (includeTree) {
		const relativePaths = sortedFiles
			.map((f) => f.relativePath)
			.filter(Boolean);
		const treeText = buildDirectoryTreeText(params.packName, relativePaths);
		parts.push(`Project structure:\n${treeText}`);
	}

	for (const file of sortedFiles) {
		const fullPath = buildFullPath(params.packName, file.relativePath);
		if (includeFileHeaders) {
			parts.push(`===== file: ${fullPath} =====`);
		}

		parts.push(`\`\`\`${file.language}\n${file.content}\n\`\`\``);
	}

	return parts.join("\n\n");
}

// Backward compatibility placeholder.
export function formatter() {
	return "";
}
