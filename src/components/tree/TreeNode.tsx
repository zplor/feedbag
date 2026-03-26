// 树节点组件占位（EN: TreeNode placeholder component）
// TODO: 后续实现文件/目录节点渲染与 checkbox（TODO: implement node rendering & checkbox）

import type React from "react";
import { memo } from "react";

export type TreeNodeProps = {
	className?: string;
};

export const TreeNode: React.FC<TreeNodeProps> = memo(({ className }) => {
	return <div className={className ?? ""} />;
});

TreeNode.displayName = "TreeNode";

