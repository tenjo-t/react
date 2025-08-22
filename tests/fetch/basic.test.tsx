/** biome-ignore-all lint/suspicious/noExplicitAny: test */
import { act, screen } from "@testing-library/react";
import { Suspense } from "react";
import { test } from "vitest";
import { useFetch } from "../../src/fetch";
import { createKey, render } from "../util";

test("suspense", async () => {
	const key = createKey();
	const { promise, resolve } = Promise.withResolvers<number>();
	const Fetch = () => {
		const [data] = useFetch(key, () => promise);
		return `resolve ${data}`;
	};

	await render(
		<Suspense fallback={"suspense"}>
			<Fetch />
		</Suspense>,
	);

	await screen.findByText("suspense");
	resolve(1);
	await screen.findByText("resolve 1");
});

test("resolved promise", async () => {
	const key = createKey();
	const promise = Promise.resolve(1);
	const Fetch = () => {
		const [data] = useFetch(key, () => promise);
		return `resolve ${data}`;
	};

	await render(
		<Suspense fallback={"suspense"}>
			<Fetch />
		</Suspense>,
	);

	await screen.findByText("resolve 1");
});

test("mutate keep previous data", async () => {
	const key = createKey();
	let { promise, resolve } = Promise.withResolvers<number>();
	let mutate: any;
	const Fetch = () => {
		const [data, isValidating, _mutate] = useFetch(key, () => promise);
		mutate = _mutate;
		return `resolve ${data}${isValidating ? " (validating...)" : ""}`;
	};

	await render(
		<Suspense fallback="suspense">
			<Fetch />
		</Suspense>,
	);

	await screen.findByText("suspense");
	resolve(1);
	await screen.findByText("resolve 1");
	({ promise, resolve } = Promise.withResolvers<number>());
	await act(async () => {
		mutate();
		await screen.findByText("resolve 1 (validating...)");
		resolve(2);
	});
	await screen.findByText("resolve 2");
});

test("mutate with optimistic data", async () => {
	const key = createKey();
	let { promise, resolve } = Promise.withResolvers<number>();
	let mutate: any;
	const Fetch = () => {
		const [data, isValidating, _mutate] = useFetch(key, () => promise);
		mutate = _mutate;
		return `resolve ${data}${isValidating ? " (validating...)" : ""}`;
	};

	await render(
		<Suspense fallback="suspense">
			<Fetch />
		</Suspense>,
	);

	await screen.findByText("suspense");
	resolve(1);
	await screen.findByText("resolve 1");
	({ promise, resolve } = Promise.withResolvers<number>());
	await act(async () => {
		mutate(2);
		await screen.findByText("resolve 2 (validating...)");
		resolve(3);
	});
	await screen.findByText("resolve 3");
});

test("mutate with optimistic promise data", async () => {
	const key = createKey();
	let { promise, resolve } = Promise.withResolvers<number>();
	let mutate: any;
	const Fetch = () => {
		const [data, isValidating, _mutate] = useFetch(key, () => promise);
		mutate = _mutate;
		return `resolve ${data}${isValidating ? " (validating...)" : ""}`;
	};

	await render(
		<Suspense fallback="suspense">
			<Fetch />
		</Suspense>,
	);

	await screen.findByText("suspense");
	resolve(1);
	await screen.findByText("resolve 1");
	({ promise, resolve } = Promise.withResolvers<number>());
	await act(async () => {
		await act(async () => {
			const optimistic = Promise.withResolvers<number>();
			mutate(optimistic.promise);
			await screen.findByText("resolve 1 (validating...)");
			optimistic.resolve(2);
		});
		await screen.findByText("resolve 2 (validating...)");
		resolve(3);
	});
	await screen.findByText("resolve 3");
});
