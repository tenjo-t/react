import { Suspense } from "react";
import { UseFetch } from "../../components/examples/use-fetch";
import { H1 } from "../../components/ui";

export default function Page() {
	return (
		<>
			<title>examples - tenjot/react</title>
			<div className="flex flex-col gap-4">
				<H1>useFetch</H1>
				<Suspense fallback="only render client">
					<UseFetch />
				</Suspense>
			</div>
		</>
	);
}

export const getConfig = () => {
	return {
		render: "static",
	} as const;
};
