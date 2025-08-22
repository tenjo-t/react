# useFetch

A hook for data fetching. `useFetch` use `useTransition` and `useOptimistic`.

```tsx
const Page = () => {
	const [content, isValidating, mutate] = useFetch(key, fetcher);
	return <div>{content}{isValidating && " (validating...)"}</div>;
};
```

## API

### Parameters

- `key`: a unique key string for the request.
- `fetcher`: a Promise-returning function to fetch your data.

### Return Values

- `data`: data for the given key resolved by `fetcher`.
- `isValidating`: if there's a request or revalidation loading.
- `mutate(data?)`: function to mutate the cached data.

## Example

[`useFetch` examples](/examples/use-fetch)

## Concept

This is a simplified version of `useFetch`.

```js
const UseFetch = () => {
	const [isValidating, startTransition] = useTransition();
	const [state, setState] = useState(promise);
	const [opt, addOpt] = useOptimistic(state, (_, a) => a);
	const data = opt instanceof Promise ? use(opt) : opt;

	const update = (msg: string) => {
		startTransition(async () => {
			addOpt(await timer(1000, "ハロー"));
			startTransition(() => setState(timer(2000, msg)));
		});
	};

	return (
		<div>
			{data}{isValidating && " (validating...)"}
			<div>
				<button type="button" onClick={() => update("こんにちは")}>
					Mutate
				</button>
			</div>
		</div>
	);
};
```
