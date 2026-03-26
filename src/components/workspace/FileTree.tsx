import type React from "react";
import { memo, useRef } from "react";
import { useWorkspaceStore } from "~/store/workspace";
import type { FileNode } from "~/types";
import { formatFileSize } from "~/utils/fileUtils";

interface FileTreeProps {
	nodes: FileNode[];
	depth?: number;
	onFileClick?: (node: FileNode) => void;
}

interface FileNodeProps {
	node: FileNode;
	depth: number;
	onFileClick?: (node: FileNode) => void;
}

const FileTreeNode: React.FC<FileNodeProps> = memo(
	({ node, depth, onFileClick }) => {
		const { expandedFolders, toggleFolder, toggleFileCheck } =
			useWorkspaceStore();
		const isExpanded = expandedFolders.has(node.path);
		const paddingLeft = depth * 1.5;
		const singleClickTimerRef = useRef<number | null>(null);

		// Single click: open file (delayed so double click can cancel).
		// 单击：打开文件（用延迟避免双击误触发打开）。
		const handleSingleClick = (e: React.MouseEvent<HTMLDivElement>) => {
			e.preventDefault();
			if (singleClickTimerRef.current) {
				window.clearTimeout(singleClickTimerRef.current);
			}
			singleClickTimerRef.current = window.setTimeout(() => {
				onFileClick?.(node);
				singleClickTimerRef.current = null;
			}, 50);
		};

		// Double click: toggle checkbox only.
		// 双击：仅切换 checkbox，不打开文件。
		const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			if (singleClickTimerRef.current) {
				window.clearTimeout(singleClickTimerRef.current);
				singleClickTimerRef.current = null;
			}
			if (node?.path) {
				toggleFileCheck(node.path);
			}
		};

		if (node.type === "folder") {
			const hasChildren = node.children && node.children.length > 0;

			return (
				<div className="mb-0.5">
					<div
						className="flex items-center gap-2 px-2 py-1.5 hover:bg-surface-container cursor-pointer group rounded"
						style={{ paddingLeft: `${paddingLeft}rem` }}
						onClick={() => hasChildren && toggleFolder(node.path)}
					>
						<button
							type="button"
							className={`material-symbols-outlined text-[18px] ${hasChildren ? "text-primary" : "text-on-surface-variant/40"}`}
						>
							{hasChildren && isExpanded ? "expand_more" : "chevron_right"}
						</button>
						<span
							className="material-symbols-outlined text-tertiary-container text-[18px]"
							style={{ fontVariationSettings: "'FILL' 1" }}
						>
							folder
						</span>
						<span className="text-xs font-medium">{node.name}</span>
					</div>
					{isExpanded && hasChildren && (
						<div className="border-l border-outline-variant/20 ml-3">
							{node.children?.map((child) => (
								<FileTreeNode
									key={child.id}
									node={child}
									depth={depth + 1}
									onFileClick={onFileClick}
								/>
							))}
						</div>
					)}
				</div>
			);
		}

		// File node
		return (
			<div
				className="flex items-center gap-2 px-2 py-1 group hover:bg-surface-container-low cursor-pointer rounded select-none"
				style={{ paddingLeft: `${paddingLeft === 0 ? 0.5 : paddingLeft}rem` }}
				onClick={handleSingleClick}
				onDoubleClick={handleDoubleClick}
			>
				<input
					checked={node.checked}
					type="checkbox"
					className="w-3 h-3 text-secondary border-outline-variant focus:ring-0 rounded-sm bg-transparent"
					onChange={() => toggleFileCheck(node.path)}
					onClick={(e) => e.stopPropagation()}
					onDoubleClick={(e) => e.stopPropagation()}
				/>
				<span className="material-symbols-outlined text-on-surface-variant/40 text-[16px]">
					description
				</span>
				<span className="text-xs flex-grow truncate">
					{node?.name ?? "UNKNOWN"}
				</span>
				<span className="text-[9px] font-mono opacity-0 group-hover:opacity-100 text-secondary transition-opacity">
					{node.size ? formatFileSize(node.size) : "0kb"}
				</span>
			</div>
		);
	},
);

FileTreeNode.displayName = "FileNode";

export const FileTree: React.FC<FileTreeProps> = memo(
	({ nodes, depth = 0, onFileClick }) => {
		if (nodes.length === 0) {
			return (
				<div className="flex flex-col items-center justify-center h-full text-on-surface-variant/50">
					<span className="text-xs">No files found</span>
				</div>
			);
		}

		return (
			<div className="flex flex-col">
				{nodes.map((node) => (
					<FileTreeNode
						key={node.id}
						node={node}
						depth={depth}
						onFileClick={onFileClick}
					/>
				))}
			</div>
		);
	},
);

FileTree.displayName = "FileTree";
