// 拖放区域占位（EN: DropZone placeholder component）
// TODO: 后续实现拖入/选择文件夹与回调（TODO: implement drag/drop folder selection & callback）

import type React from "react";
import { memo } from "react";

export type DropZoneProps = {
	className?: string;
	onDrop?: (files: FileList | null) => void;
};

export const DropZone: React.FC<DropZoneProps> = memo(({ className, onDrop }) => {
	return (
		<div
			className={[
				"rounded-arboreal",
				"border",
				"border-dashed",
				"border-[#C8C6BE]",
				"p-4",
				"text-[#6B7A6B]",
				className ?? "",
			].join(" ")}
			onDragOver={(e) => {
				e.preventDefault();
			}}
			onDrop={(e) => {
				e.preventDefault();
				onDrop?.(e.dataTransfer?.files ?? null);
			}}
		>
			Drop files or folders here
		</div>
	);
});

DropZone.displayName = "DropZone";

