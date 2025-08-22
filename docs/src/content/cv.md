# cv

A class variance utility even smaller than [cva](https://github.com/joe-bell/cva).

```js
const variants = cv("default values", {
    color: {
        default: "text-blue",
        secondary: "text-red",
    },
    size: {
        default: "text-base",
        large: "text-lg"
    }
});
variants({color: "secondary"}); // "default values text-red text-base"
```

## API

### Parameters

- A string of base class names that are always applied.
- A mapping of variant categories to their possible values and corresponding class names.

Each category can have a `default` key, which is used when no value is provided for that category.

### Return Values

- Returns a function that takes an options object and generates a class string.

For each category, it picks the class corresponding to the provided option, or falls back to the `default` if not specified.
The final result is the base string combined with the selected classes, separated by spaces.

## Typescript

```ts
type Props = CVProps<typeof variants>
```