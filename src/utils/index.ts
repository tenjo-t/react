import { IS_CLIENT } from "../shared";

/**
 * Ensures the component is only rendered on the client.
 *  The parent component must be wrapped with `Suspense`,
 *  and a `fallback` must also be provided.
 */
export const shouldOnlyRenderClient = (): void => {
	if (!IS_CLIENT) {
		throw Error("this component should only render client");
	}
};
