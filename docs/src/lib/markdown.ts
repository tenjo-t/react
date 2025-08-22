import rehypeShiki from "@shikijs/rehype";
import rehypeClassNames from "rehype-class-names";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const parser = unified()
	.use(remarkParse)
	.use(remarkRehype, { allowDangerousHtml: true })
	.use(
		function (...args) {
			return rehypeClassNames.apply(this, args);
		},
		{
			h1: "text-3xl",
			h2: "text-xl border-b border-zinc-500",
			h3: "text-lg font-bold",
			ul: "pl-4 list-disc",
			a: "underline hover:no-underline focus:no-underline text-indigo-700 visited:text-fuchsia-700",
			code: "inline-block px-1 bg-zinc-200 rounded",
		},
	)
	.use(rehypeShiki, { theme: "one-dark-pro" })
	.use(
		function (...args) {
			return rehypeClassNames.apply(this, args);
		},
		{ pre: "p-4 rounded shadow" },
	)
	.use(rehypeStringify, { allowDangerousHtml: true });

export const compile = async (src: string) => {
	return (await parser.process(src)).toString();
};
