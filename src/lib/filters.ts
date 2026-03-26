import type { FileNode } from "~/types";

export const DEFAULT_IGNORE_PATTERNS_TEXT = [
	"# Default ignore patterns (gitignore-like)",
	".git/",
	".gitignore",
	".env",
	".env.*",
	"*.env",
	".DS_Store",
	"node_modules/",
	"dist/",
	"build/",
	"out/",
	".turbo/",
	".windsurf/",
	".pnpm-debug.log*",
	"*.log",
	"*.lock",
	"",
].join("\n");

type ParsedIgnorePattern = {
	original: string;
	negated: boolean;
	pattern: string;
};

function normalizePath(input: string): string {
	return (input ?? "").replaceAll("\\", "/");
}

function parseIgnorePatterns(text: string): ParsedIgnorePattern[] {
	const raw = text ?? "";
	const lines = raw.split("\n");
	const patterns: ParsedIgnorePattern[] = [];

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		if (trimmed.startsWith("#")) continue;

		// EN: .gitignore inline comment is complex; keep it simple:
		// If the whole trimmed line starts with "#", we treat as comment.
		let negated = false;
		let pattern = trimmed;
		if (pattern.startsWith("!")) {
			negated = true;
			pattern = pattern.slice(1).trim();
		}

		if (!pattern) continue;
		patterns.push({
			original: trimmed,
			negated,
			pattern,
		});
	}

	return patterns;
}

function globToRegExp(glob: string): RegExp {
	// EN: Simple glob:
	// - ** matches any path segments
	// - * matches within a single path segment
	// - ? matches a single character within a single path segment
	const normalized = normalizePath(glob);
	const placeholder = "__FEEDBAG_GLOBSTAR__";
	// 1) Protect `**` first
	const withDoubleStar = normalized.replaceAll("**", placeholder);
	// 2) Escape regex meta chars (except `*` and `?`, which we handle later)
	const escaped = withDoubleStar.replace(/[.+^${}()|[\]\\]/g, "\\$&");
	// 3) Escape glob tokens so they won't be interpreted by RegExp
	const escapedGlobTokens = escaped
		.replaceAll("*", "\\*")
		.replaceAll("?", "\\?");
	// 4) Restore placeholders and translate tokens
	const reSource = escapedGlobTokens
		.replaceAll(placeholder, ".*")
		.replaceAll("\\*", "[^/]*")
		.replaceAll("\\?", "[^/]");
	return new RegExp(`^${reSource}$`);
}

function globMatch(glob: string, text: string): boolean {
	const g = normalizePath(glob);
	const t = normalizePath(text);

	if (!g.includes("*") && !g.includes("?")) {
		return g === t;
	}

	return globToRegExp(g).test(t);
}

function shouldIgnoreNode(
	node: FileNode,
	patterns: ParsedIgnorePattern[],
): boolean {
	const relativePath = normalizePath(node?.path ?? "");
	const basename = normalizePath(node?.name ?? "");

	// EN: .gitignore uses last-match-wins. We'll implement the same.
	let ignored = false;
	for (const item of patterns) {
		const rawPattern = item.pattern;
		if (!rawPattern) continue;

		const anchored = rawPattern.startsWith("/");
		const effectivePattern = anchored ? rawPattern.slice(1) : rawPattern;

		// Directory ignore: pattern like `node_modules/`
		if (effectivePattern.endsWith("/")) {
			const dirPattern = effectivePattern.slice(0, -1);
			if (!dirPattern) continue;

			if (
				dirPattern.includes("/") ||
				dirPattern.includes("*") ||
				dirPattern.includes("?")
			) {
				const matchText = anchored ? `${dirPattern}/` : `**/${dirPattern}/`;
				const looksMatch = globMatch(matchText, relativePath);
				if (looksMatch) ignored = !item.negated;
				continue;
			}

			// EN: Unwildcarded dir pattern without `/`:
			// Match if the path is inside this directory at any depth (unless anchored).
			const exactMatch = relativePath === dirPattern;
			const prefixMatch = relativePath.startsWith(`${dirPattern}/`);
			const innerMatch = relativePath.includes(`/${dirPattern}/`);
			const suffixDirMatch = relativePath.endsWith(`/${dirPattern}`);

			if (anchored) {
				if (exactMatch || prefixMatch) ignored = !item.negated;
			} else {
				if (exactMatch || prefixMatch || innerMatch || suffixDirMatch) {
					ignored = !item.negated;
				}
			}

			continue;
		}

		// File or directory name pattern
		if (!effectivePattern.includes("/")) {
			// EN: No slash => match basename.
			if (globMatch(effectivePattern, basename)) {
				ignored = !item.negated;
			}
			continue;
		}

		// EN: Pattern includes `/` => match against relative path.
		const match = globMatch(effectivePattern, relativePath);
		if (match) ignored = !item.negated;
	}

	return ignored;
}

export function filterFileTreeByIgnorePatterns(
	nodes: FileNode[],
	ignorePatternsText: string,
): FileNode[] {
	const patterns = parseIgnorePatterns(ignorePatternsText);
	const safeNodes = Array.isArray(nodes) ? nodes : [];
	if (patterns.length === 0) return safeNodes;

	const walk = (tree: FileNode[]): FileNode[] => {
		const out: FileNode[] = [];
		for (const node of tree) {
			if (!node) continue;

			if (shouldIgnoreNode(node, patterns)) {
				continue;
			}

			if (node.type === "folder") {
				const children = Array.isArray(node.children) ? node.children : [];
				const filteredChildren = walk(children);
				if (filteredChildren.length > 0) {
					out.push({ ...node, children: filteredChildren });
				}
				continue;
			}

			// file node
			out.push(node);
		}

		return out;
	};

	return walk(safeNodes);
}
