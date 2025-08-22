import { render as _render, act } from "@testing-library/react";
import { type ReactNode, StrictMode } from "react";

export const createKey = () => `fetch-${~~(Math.random() * 1e7)}`;

export const render = (ui: ReactNode): Promise<void> =>
	act(async () => {
		_render(<StrictMode>{ui}</StrictMode>);
	});
