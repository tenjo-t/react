import fs from "node:fs/promises";
import { compile } from "../lib/markdown";

export default async function Page() {
	const data = await getData();

	return (
		<>
			<title>{data.title}</title>
			<div
				className="flex flex-col gap-4"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: markdown
				dangerouslySetInnerHTML={{ __html: data.content }}
			></div>
		</>
	);
}

const getData = async () => {
	const file = await fs.readFile("docs/src/content/index.md");
	const src = file.toString("utf-8");
	return {
		title: "tenjot/react",
		content: await compile(src),
	};
};

export const getConfig = async () => {
	return {
		render: "dynamic",
	};
};
