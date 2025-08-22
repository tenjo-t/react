"use client";

import { Suspense, useState } from "react";
import { mutate, useFetch } from "../../../../src/fetch";
import { shouldOnlyRenderClient } from "../../../../src/utils";
import { Button, Input } from "../ui";

export const UseFetch = () => {
	shouldOnlyRenderClient();

	const [value, setValue] = useState("hello");

	return (
		<>
			<Suspense fallback={"suspense..."}>
				<Fetch />
			</Suspense>
			<div className="flex gap-2">
				<Input
					type="text"
					value={value}
					onChange={(e) => setValue(e.currentTarget.value)}
				/>
				<Button type="button" onClick={() => resolve(value)}>
					Resolve
				</Button>
				<Button type="button" onClick={() => reject(new Error())}>
					Reject
				</Button>
				<Button type="button" onClick={() => mutate("1", "こんにちは")}>
					Mutate
				</Button>
			</div>
		</>
	);
};

let { promise, resolve, reject } = Promise.withResolvers<string>();

const Fetch = () => {
	const [data, isValidating] = useFetch("1", () => {
		({ promise, resolve, reject } = Promise.withResolvers<string>());
		return promise;
	});

	return (
		<div>
			resolve: {data}
			{isValidating && " (validating...)"}
		</div>
	);
};
