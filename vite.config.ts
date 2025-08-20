import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), cloudflare(), tailwindcss(), VitePWA({
		registerType: "autoUpdate",
		injectRegister: false,

		pwaAssets: {
			disabled: true,
			config: true
		},

		manifest: {
			name: "Pocker - Universal Local-First Bookmarks Manager",
			short_name: "Pocker",
			description: "Save and access your bookmarks from anywhere with Pocker, the seamless local-first bookmarking tool for professionals and casual users alike",
			theme_color: "#000000",
		},

		devOptions: {
			enabled: true,
		}
	})],
	optimizeDeps: {
		exclude: ["@sqlite.org/sqlite-wasm", "kysely", "@evolu/web"]
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
