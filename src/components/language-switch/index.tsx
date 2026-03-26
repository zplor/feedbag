import type React from "react";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";

export type Language = "en" | "zh";

export interface LanguageSwitchButtonProps {
	className?: string;
}

// Normalize i18n language into our supported set.
// 归一化 i18n 的 language 到我们支持的语言集合
const normalizeLanguage = (value: unknown): Language => {
	const raw = typeof value === "string" ? value : "";
	return raw.toLowerCase().startsWith("zh") ? "en" : "zh";
};

export const LanguageSwitchButton: React.FC<LanguageSwitchButtonProps> = memo(
	({ className = "" }) => {
		const { i18n } = useTranslation();

		const handleToggle = useCallback(() => {
			const next: Language = normalizeLanguage(i18n?.language);
			void i18n?.changeLanguage?.(next);
		}, [i18n]);

		return (
			<button
				type="button"
				onClick={handleToggle}
				aria-label="Switch language"
				className={[
					"flex items-center gap-2 font-mono uppercase tracking-widest text-[10px] py-1",
					"hover:text-[#8FAF6E] transition-colors",
					// Landing/Dashboard 都是浅色底；具体颜色由父容器 `text-[#ECEAE4]` 提供。
					className,
				].join(" ")}
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<title>{i18n.language}</title>
					<circle
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="2"
					/>
					<path
						d="M2 12H22"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
					/>
					<path
						d="M12 2C14.5 4.8 16 8.2 16 12C16 15.8 14.5 19.2 12 19.2 8 15.8 12Z"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
		);
	},
);

LanguageSwitchButton.displayName = "LanguageSwitchButton";
