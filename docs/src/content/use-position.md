# usePosition

A React hook that returns the position of a DOM element.
The position is updated when the element is scrolled.

```js
function Component() {
  const [ref, position] = usePosition();

  return (
    <div ref={ref}>
      {position && <p>Position: {position.x}, {position.y}</p>}
    </div>
  );
};
```

## API

### Return Values

A tuple containing:
- A `RefObject` to be attached to the element.
- The `DOMRect` of the element, or `null` if not available.
