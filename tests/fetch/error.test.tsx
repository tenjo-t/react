import { screen } from "@testing-library/react";
import { Component, type ReactNode, Suspense } from "react";
import { afterEach, beforeEach, test, vi } from "vitest";
import { useFetch } from "../../src/fetch";
import { render } from "../util";

const consoleError = console.error;
const errorMessages: string[] = [];
beforeEach(() => {
	errorMessages.splice(0);
	console.error = vi.fn((err: string) => {
		const match = /^(.*?)(\n|$)/.exec(err);
		if (match?.[1]) {
			errorMessages.push(match[1]);
		}
	});
});
afterEach(() => {
	console.error = consoleError;
});

test("suspense", async () => {
	const { promise, reject } = Promise.withResolvers<number>();
	const Fetch = () => {
		const [data] = useFetch("suspend", () => promise);
		return `resolve ${data}`;
	};

	await render(
		<ErrorBoundary>
			<Suspense fallback={"suspense"}>
				<Fetch />
			</Suspense>
		</ErrorBoundary>,
	);

	await screen.findByText("suspense");
	reject(new Error());
	await screen.findByText("error:");
});

class ErrorBoundary extends Component<
	{ children: ReactNode },
	{ hasError: false } | { hasError: true; error: Error }
> {
	constructor(props: { message?: string; children: ReactNode }) {
		super(props);
		this.state = { hasError: false };
	}
	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}
	render() {
		return this.state.hasError ? (
			<div>
				error: {this.state.error.message}
				<button
					type="button"
					onClick={() => this.setState({ hasError: false })}
				>
					retry
				</button>
			</div>
		) : (
			this.props.children
		);
	}
}
