// Toast 组件占位（EN: Toast placeholder component）
// TODO: 后续实现队列/持续时间/关闭行为（TODO: implement queue/duration/close behavior）

import type React from "react";
import { memo } from "react";

export type ToastProps = {
	message?: string;
	className?: string;
};

export const Toast: React.FC<ToastProps> = memo(({ message, className }) => {
	return (
		<div className={["px-4", "py-2", "rounded-arboreal", "bg-[#2D3B2D]", "text-[#ECEAE4]", className ?? ""].join(" ")}>
			{message ?? ""}
		</div>
	);
});

Toast.displayName = "Toast";

