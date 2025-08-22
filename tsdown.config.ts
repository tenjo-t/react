import { defineConfig } from "tsdown";

export default defineConfig({
	entry: {
		cv: "./src/cv",
		fetch: "./src/fetch",
		utils: "./src/utils",
	},
	dts: true,
});
