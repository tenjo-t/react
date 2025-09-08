// https://github.com/joe-bell/cva

import clsx from "clsx";

type VariantsSchema = Record<string, Record<string, string>>;
type VariantsProps<T extends VariantsSchema> =
	| { [V in keyof T]?: keyof T[V] }
	| null
	| undefined;
type Variants<T> = T extends VariantsSchema ? T : never;
type Props<T> = T extends VariantsSchema
	? VariantsProps<T> & { className?: string }
	: { className?: string };

type OmitUndefined<T> = T extends undefined ? never : T;
export type CVProps<CV extends (props: Props<unknown>) => string> = Omit<
	OmitUndefined<Parameters<CV>[0]>,
	"className"
>;

export function cv<T>(base: string, variants: Variants<T>) {
	const keys: (keyof Variants<T>)[] = Object.keys(variants);
	return (props: Props<T>): string => {
		return clsx(
			base,
			...keys.map((key) => {
				const variant = props[key as keyof typeof props] || "default";
				if (variant == null) return;
				// biome-ignore lint/style/noNonNullAssertion: key type is `keyof Variants<T>`
				return variants[key]![variant as string];
			}),
			props.className,
		);
	};
}
