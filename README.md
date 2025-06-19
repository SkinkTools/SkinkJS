# SkinkJS

A small subset of useful Python features.

## Nicer Syntax

SkinkJS adds readable loop helpers.

Instead of `for(let i = 0; i < 10; i++)`, use `range(10)`:

```javascript
for(const i of range(10)) {
    console.log(`index is ${i}`);
}
```

Or use `zip()` to combine iterables such as Skink's `cycle()`:
```javascript
const xValues = [1, 3, 5];

// Prints [1, 0, 0], [3, 1, 0], [5, 2, 0]
for(const pointXYZ of zip(xValues, range(3), repeat([0,],3))) {
    console.log(pointXYZ);
}
```

## Quickstart

1. Make a `scripts` directory
2. Download [`skink.min.js`][skink-raw] to it
3. Add this in your HTML:
   ```html
   <script src="/scripts/skink.min.js" type="text/javascript">
   ```

You're now ready to write nice `for` loops.

## Where to next?

| [Tutorials, please!][] | [I know Python][]  | (Keep reading) |
|:------------------:|:----------------:|:--------------------:|

[Tutorials, please!]: https://example.com/
[I know Python]: https://python.org/

