import fs from "node:fs/promises";
import type { PageProps } from "waku/router";
import { getContents } from "../../content";
import { compile } from "../../lib/markdown";

export default async function Page({ util }: PageProps<"/utils/[util]">) {
	const data = await getData(util);

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

const getData = async (slug: string) => {
	const file = await fs.readFile(`docs/src/content/${slug || "index"}.md`);
	const src = file.toString("utf-8");
	return {
		title: `${slug} - tenjot/react`,
		content: await compile(src),
	};
};

export const getConfig = async () => {
	return {
		render: "static",
		staticPaths: getContents(),
	};
};
