import "../styles.css";

import type { ReactNode } from "react";
import { Link } from "waku";

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
	const data = await getData();

	return (
		<div className="bg-zinc-100 text-zinc-800 text-base">
			<meta name="description" content={data.description} />
			<header className="border-b border-zinc-500">
				<div className="px-8 py-4 mx-auto max-w-3xl flex justify-between">
					<div>
						<Link to="/">tenjot/react 🥷</Link>
					</div>
					<div>
						<a href="https://github.com/tenjo-t/react">GitHub</a>
					</div>
				</div>
			</header>
			<main className="p-8 mx-auto max-w-3xl">{children}</main>
			<footer className="p-8 mx-auto max-w-3xl pt-16 text-center">
				© 2025 tenjo-t
			</footer>
		</div>
	);
}

const getData = async () => {
	const data = {
		description: "collection of react utilities",
	};
	return data;
};

export const getConfig = async () => {
	return {
		render: "static",
	};
};
