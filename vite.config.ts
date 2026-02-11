import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), cloudflare(), tailwindcss(), VitePWA({
		includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
		manifest: {
			name: "LocalMark",
			short_name: "LocalMark",
			description: "Save and access your bookmarks from anywhere with LocalMark, the seamless local-first bookmarking tool for professionals and casual users alike",
			theme_color: "#9333ea",
			background_color: "#ede9fe", // violet-100
			icons: [
				{
					src: 'favicon-150x150.png',
					sizes: '150x150',
					type: 'image/png'
				},
				{
					src: 'favicon-384x384.png',
					sizes: '384x384',
					type: 'image/png'
				},
				{
					src: 'favicon-512x512.png',
					sizes: '512x512',
					type: 'image/png'
				}
			]
		},
	}
	)],
	optimizeDeps: {
		exclude: ["@evolu/web"]
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
