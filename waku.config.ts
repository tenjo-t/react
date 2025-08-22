import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "waku/config";

export default defineConfig({
	vite: {
		root: "docs",
		plugins: [tailwindcss()],
	},
});
