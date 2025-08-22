"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes } from "react";

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => (
	<input className="px-4 py-1 border border-zinc-500 rounded" {...props} />
);

export const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
	<button
		className="px-4 py-1 bg-zinc-600 hover:bg-zinc-700 focus:bg-zinc-700 active:bg-zinc-800 text-white rounded transition"
		{...props}
	/>
);
