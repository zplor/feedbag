// 开关组件占位（EN: Toggle placeholder component）
// TODO: 后续实现可访问性与受控状态（TODO: implement accessibility & controlled state）

import type React from "react";
import { memo } from "react";

export type ToggleProps = {
	enabled?: boolean;
	className?: string;
	onToggle?: (enabled: boolean) => void;
};

export const Toggle: React.FC<ToggleProps> = memo(
	({ enabled = false, className, onToggle }) => {
		return (
			<button
				type="button"
				aria-pressed={enabled}
				onClick={() => onToggle?.(!enabled)}
				className={[
					"px-3",
					"py-1.5",
					"rounded-arboreal",
					"border",
					"transition-colors",
					enabled
						? "bg-[#8FAF6E]/20 border-[#8FAF6E] text-[#4a662e]"
						: "bg-transparent border-[#C8C6BE] text-[#1b1c18]",
					className ?? "",
				].join(" ")}
			>
				{enabled ? "ON" : "OFF"}
			</button>
		);
	},
);

Toggle.displayName = "Toggle";

