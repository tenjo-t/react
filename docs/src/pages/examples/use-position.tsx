import { UsePosition } from "../../components/examples/use-position";
import { H1 } from "../../components/ui";

export default function Page() {
	return (
		<>
			<title>examples - tenjot/react</title>
			<div className="flex flex-col gap-4">
				<H1>usePosition</H1>
				<UsePosition />
				<p>
					Elements with the popover attribute are displayed in the top layer, so
					they cannot be positioned relative to other elements shown in the
					backdrop. Until CSS anchor positioning becomes available in all
					browsers, it is necessary to get the position of other elements with
					JavaScript.
				</p>
				<UsePosition />
				<div>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua.
				</div>
				<UsePosition />
				<div>
					Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
					nisi ut aliquip ex ea commodo consequat.
				</div>
				<UsePosition />
				<div>
					Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
					dolore eu fugiat nulla pariatur.
				</div>
				<UsePosition />
				<div>
					Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
					officia deserunt mollit anim id est laborum.
				</div>
				<UsePosition />
			</div>
		</>
	);
}
