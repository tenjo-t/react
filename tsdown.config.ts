import { defineConfig } from "tsdown";

export default defineConfig({
	entry: {
		cv: "./src/cv.ts",
		fetch: "./src/fetch",
		position: "./src/position.ts",
		utils: "./src/utils",
	},
	dts: true,
});
