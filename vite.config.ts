import path from "path";
import { defineConfig } from "vite";

const resolve = (...dir: string[]) => path.resolve(__dirname, ...dir);

export default defineConfig({
	resolve: {
		alias: {
			"~": resolve("src"),
		},
	},
	publicDir: resolve("./public"),
	build: {
		rollupOptions: {
			output: {
				// Manually split vendor chunks to improve caching and initial load performance.
				manualChunks: (id) => {
					if (!id.includes("node_modules")) {
						return undefined;
					}

					if (
						id.includes("react") ||
						id.includes("react-dom") ||
						id.includes("react-router")
					) {
						return "vendor-react";
					}

					if (id.includes("i18next") || id.includes("react-i18next")) {
						return "vendor-i18n";
					}

					return "vendor";
				},
				chunkFileNames: "assets/js/[name]-[hash].js",
				entryFileNames: "assets/js/[name]-[hash].js",
				assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
			},
		},
		minify: "esbuild",
		chunkSizeWarningLimit: 1000,
	},
});
