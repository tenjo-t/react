import {
	use,
	useCallback,
	useDebugValue,
	useEffect,
	useLayoutEffect,
	useOptimistic,
	useRef,
	useState,
	useTransition,
} from "react";
import type { Awaitable, valueof } from "../../src/shared";

export type Key = string;
export type Fetcher<T> = (key?: string) => Promise<T>;
type Response<T> = [T, boolean, (optimistics?: Awaitable<T>) => void];

type RevalidateOptions<T> = {
	optimistic?: Awaitable<T> | undefined;
	dedupe?: boolean | undefined;
	retry?: number | undefined;
};
type Revalidate<T> = (
	type: valueof<typeof EVENT>,
	options?: RevalidateOptions<T>,
) => void;

type State<T = unknown> = {
	promise?: Promise<T> | undefined;
	optimistic?: Awaitable<T> | undefined;
	listeners: Set<() => void>;
};
const stateMap = new Map<Key, State>();
const getState = <T>(key: Key) => {
	let state = stateMap.get(key) as State<T>;
	if (!state) {
		state = { listeners: new Set() };
		stateMap.set(key, state);
	}
	return state;
};
const setState = <T>(
	key: Key,
	promise: Promise<T>,
	optimistic?: Awaitable<T> | undefined,
) => {
	const state = getState<T>(key);
	state.promise = promise;
	state.optimistic = optimistic;
	state.listeners.forEach((l) => l());
};

const EVENT = {
	MUTATE: 2,
	ERROR: 3,
} as const;

let _timestamp = 0;
const getTimestamp = () => ++_timestamp;

const REVALIDATORS: Record<Key, Revalidate<unknown>[]> = Object.create(null);
const FETCH: Record<Key, [Promise<unknown>, number]> = Object.create(null);

const subscribe = <T>(key: Key, cb: Revalidate<T>) => {
	let revalidators = REVALIDATORS[key] as Revalidate<T>[];
	if (!revalidators) {
		revalidators = [];
		(REVALIDATORS[key] as Revalidate<T>[]) = revalidators;
	}
	revalidators.push(cb);
	return () => {
		const i = revalidators.indexOf(cb);
		if (i >= 0) {
			revalidators[i] = revalidators[revalidators.length - 1] as Revalidate<T>;
			revalidators.pop();
		}
	};
};

export const useFetch = <T>(key: Key, fetcher: Fetcher<T>): Response<T> => {
	const unmountedRef = useRef(false);
	const keyRef = useRef(key);
	const fetcherRef = useRef(fetcher);

	const revalidate = useCallback(
		(options: RevalidateOptions<T> = {}) => {
			if (unmountedRef.current) return;

			const shouldStartNewRequest = !FETCH[key] || !options.dedupe;
			if (shouldStartNewRequest) {
				const startAt = getTimestamp();
				const cleanup = () => {
					const info = FETCH[key];
					if (info && info[1] === startAt) delete FETCH[key];
				};
				const promise = fetcherRef
					.current(key)
					.then((d) => {
						setTimeout(cleanup, 2000);
						return d;
					})
					.catch((e) => {
						cleanup();
						if (key === keyRef.current) {
							const revalidate = (options: RevalidateOptions<T>) => {
								const revalidators = REVALIDATORS[key];
								if (revalidators?.[0]) {
									revalidators[0](EVENT.ERROR, options);
								}
							};
							onErrorRetry(revalidate, true, (options.retry || 0) + 1);
						}
						throw e;
					});
				FETCH[key] = [promise, startAt];
				setState(key, promise, options.optimistic);
			}
		},
		[key],
	);

	const state = getState<T>(key);
	const [promise, setPromise] = useState(state.promise);
	const [opt, addOptimistic] = useOptimistic<Awaitable<T> | undefined, T>(
		promise,
		(_, a) => a,
	);

	const [isValidating, startTransition] = useTransition();
	// biome-ignore lint/correctness/useExhaustiveDependencies: `addOptimistic`
	useEffect(() => {
		const callback = () =>
			startTransition(async () => {
				if (state.optimistic !== undefined) {
					addOptimistic(
						state.optimistic instanceof Promise
							? await state.optimistic
							: state.optimistic,
					);
				}
				startTransition(() => setPromise(state.promise));
			});
		state.listeners.add(callback);
		callback();
		return () => {
			state.listeners.delete(callback);
		};
	}, [state]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: `revalidate`
	useLayoutEffect(() => {
		unmountedRef.current = false;
		keyRef.current = key;

		const onRevalidate: Revalidate<T> = (type, options) => {
			switch (type) {
				case EVENT.MUTATE:
					return revalidate({ optimistic: options?.optimistic });
				case EVENT.ERROR:
					return revalidate({ dedupe: options?.dedupe, retry: options?.retry });
			}
		};
		const unsub = subscribe(key, onRevalidate);

		return () => {
			unmountedRef.current = true;
			unsub();
		};
	}, [key]);

	if (key && promise === undefined) {
		fetcherRef.current = fetcher;
		if (!FETCH[key]) {
			const startAt = getTimestamp();
			const cleanup = () => {
				const info = FETCH[key];
				if (info && info[1] === startAt) delete FETCH[key];
			};
			const promise = fetcherRef.current(key).then(
				(d) => {
					setTimeout(cleanup, 2000);
					return d;
				},
				(e) => {
					cleanup();
					if (key === keyRef.current) {
						const revalidate = (option: RevalidateOptions<T>) => {
							const revalidators = REVALIDATORS[key];
							if (revalidators?.[0]) {
								revalidators[0](EVENT.ERROR, option);
							}
						};
						onErrorRetry(revalidate, true, 1);
					}
					throw e;
				},
			);
			FETCH[key] = [promise, startAt];
			state.promise = promise;
			setPromise(promise);
		}
	}
	const data = opt instanceof Promise ? use(opt) : opt;

	useDebugValue(data);

	const boundMutate = (mutate<T>).bind(undefined, key);

	return [data as T, isValidating, boundMutate];
};

const onErrorRetry = <T>(
	revalidate: (options: RevalidateOptions<T>) => void,
	dedupe: boolean,
	retry: number,
) => {
	// Exponential backoff
	const timeout =
		~~((Math.random() + 0.5) * (1 << (retry < 8 ? retry : 8))) * 5000;
	setTimeout(revalidate, timeout, { dedupe, retry });
};

export const mutate = <T>(
	key: Key,
	optimistic?: Awaitable<T>,
): Awaitable<T> => {
	const revalidators = REVALIDATORS[key];
	delete FETCH[key];
	if (revalidators?.[0]) revalidators?.[0](EVENT.MUTATE, { optimistic });
	return optimistic ?? (getState<T>(key).promise as Promise<T>);
};
