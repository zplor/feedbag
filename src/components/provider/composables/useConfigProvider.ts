import { type ThemeConfig, theme } from "antd";
import deepmerge from "deepmerge";
import { create } from "zustand";

export interface ConfigProviderState {
	theme: ThemeConfig;
	updateTheme: (config: Partial<ThemeConfig>) => void;
}

export const useConfigProvider = create<ConfigProviderState>((set) => ({
	theme: {
		cssVar: {
			key: "feedbag",
		},
		token: {
			colorPrimary: "#facc15",
			borderRadius: 8,
			controlItemBgActive: "var(--feedbag-tertiary-hover)",
			controlItemBgActiveHover: "var(--feedbag-tertiary-hover)",
			// Modal specific tokens
			colorBgMask: "var(--feedbag-modal-mask)",
			boxShadow: "0 8px 32px 0 #00000014",
			// Input focus styles - remove outline and box-shadow
			controlOutline: "none",
			controlOutlineWidth: 0,
			controlBoxShadow: "none",
		},
		algorithm: theme.defaultAlgorithm,
	},
	updateTheme: (config) =>
		set((state) => ({
			theme: deepmerge(state.theme, config),
		})),
}));
