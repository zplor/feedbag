// 按钮组件占位（EN: Button placeholder component）
// TODO: 后续实现统一的主题与交互样式（TODO: implement unified theme & interactions）

import type React from "react";
import { memo } from "react";

export type ButtonProps = {
	children?: React.ReactNode;
	className?: string;
	onClick?: () => void;
};

export const Button: React.FC<ButtonProps> = memo(
	({ children, className, onClick }) => {
		return (
			<button
				type="button"
				onClick={onClick}
				className={[
					"px-3",
					"py-2",
					"rounded-arboreal",
					"bg-[#2D3B2D]",
					"text-[#ECEAE4]",
					"hover:bg-[#536252]",
					"transition-colors",
					className ?? "",
				].join(" ")}
			>
				{children}
			</button>
		);
	},
);

Button.displayName = "Button";

