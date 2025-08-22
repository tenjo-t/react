# utils

## `shouldOnlyRenderClient`

Providing a fallback for server errors and client-only content.

```js
"use client"
const Client = () => {
    shouldOnlyRenderClient()
    return (
        <div>this component only render client</div>
    );
};
```

```js
const Server = () => {
    return (
        <Suspense fallback="fallback at server-side rendering">
            <Client />
        </Suspense>
    );
};
```

詳しくは[react.dev](https://react.dev/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)を参照。
