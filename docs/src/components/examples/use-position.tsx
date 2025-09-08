"use client";

import { useId } from "react";
import { usePosition } from "../../../../src/position";
import { Button } from "../ui";

export const UsePosition = () => {
	const id = useId();
	const [ref, pos] = usePosition<HTMLButtonElement>();

	return (
		<div>
			<Button type="button" popoverTarget={id} ref={ref}>
				Open
			</Button>
			<div
				id={id}
				popover=""
				className="p-2 border border-zinc-300 rounded shadow"
				style={{
					top: pos && pos.bottom + 8,
					left: pos?.left,
				}}
			>
				Popover
			</div>
		</div>
	);
};
