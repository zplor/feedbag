// Checkbox 组件占位（EN: Checkbox placeholder component）
// TODO: 后续实现受控/非受控与样式一致性（TODO: implement controlled/uncontrolled behavior & consistent styling）

import type React from "react";
import { memo } from "react";

export type CheckboxProps = {
	checked?: boolean;
	className?: string;
	onChange?: (checked: boolean) => void;
	label?: React.ReactNode;
};

export const Checkbox: React.FC<CheckboxProps> = memo(
	({ checked = false, className, onChange, label }) => {
		return (
			<label className={["inline-flex items-center gap-2", className ?? ""].join(" ")}>
				<input
					type="checkbox"
					checked={checked}
					onChange={(e) => onChange?.(e.target.checked)}
					className="accent-[#8FAF6E]"
				/>
				<span>{label}</span>
			</label>
		);
	},
);

Checkbox.displayName = "Checkbox";

