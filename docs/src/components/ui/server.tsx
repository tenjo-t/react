import type { HTMLAttributes } from "react";

export const H1 = (props: HTMLAttributes<HTMLHeadingElement>) => (
	<h1 className="text-3xl" {...props} />
);
