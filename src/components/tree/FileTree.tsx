// 文件树组件占位（EN: FileTree placeholder component）
// TODO: 后续实现递归渲染与选择逻辑（TODO: implement recursive rendering & selection）

import type React from "react";
import { memo } from "react";

export type FileTreeProps = {
	className?: string;
};

export const FileTree: React.FC<FileTreeProps> = memo(({ className }) => {
	return <div className={className ?? ""} />;
});

FileTree.displayName = "FileTree";

