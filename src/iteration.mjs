/**
 * @module skinkjs/iteration
 *
 * @public
 * @description # Iteration
 *
 * Iteration helper functions for common tasks.
 *
 * | ℹ️ [Step-by-step instructions](../#step-by-step) are available for users new to HTML or JavaScript. |
 * |:---------------------------------------------------------------------------------------------------:|
 *
 * ## Technical Overview
 *
 * The helpers in this module are generally composed of:
 *
 * 1. An inner generator function
 * 2. An outer validation wrapper
 *
 * The functions you call return the generator after validating input.
 *
 */

import { positiveMod } from "./operators.mjs";

function* _asGeneratorInner(iterable) {
    for(const item of iterable) {
        yield item;
    }
}

/**
 * @summary A generator which will *always* be empty.
 * @constant
 *
 */
export const EMPTY_GENERATOR = (function*() {})();

/**
 * Convenience function to check whether something is iterable.
 *
 *
 * @param {*} iterable An item to check for `Symbol.iterator` presence.
 * @returns {boolean} Whether the item is iterable.
 */
export function hasSymbolIterator(iterable) {
    return ! (
            (iterable === undefined)
            || (iterable === null)
            || (typeof iterable[Symbol.iterator] !== 'function')
    );
}
/**
 * @summary Return a generator over the passed iterable.
 *
 * @example
 * // Return a generator over an array
 * const array = [1, 2, 3]
 * for(const item of asGenerator(array)) {
 *      console.log(`Item value is ${item}`);    
 * }
 *
 * @public
 * @function 
 * @param {Iterable<T>} iterable Any iterable
 * @returns {Generator<T>} A generator over the iterable.
 */
export function asGenerator(iterable) {
    if(! hasSymbolIterator(iterable)) {
        throw new TypeError(`No Symbol.iterator on ${JSON.stringify(iterable)}`);
    } else if (('length' in iterable) && (iterable.length === 0)) {
        return EMPTY_GENERATOR;
    } else {
        return _asGeneratorInner(iterable);
    }
}

/**
 * Inner, non-exported generator function.
 * 
 * This is a seperate function because JS generator functions
 * have counter-intuitive behavior compared to those of other
 * languages:
 * 1. The state is stored at creation timegi
 * 2. No validation (or any other) part of the function body fires till .next()'s called
 *
 * @ignore
 */
function* _rangeGenerator(beginEndStep) {
    const {begin, end, step} = beginEndStep;
    for (var i = begin; (end - i) > 0; i += step)
        yield i;
}

/**
 * @public
 * @function
 * @summary Iterate from `start` to `stop` by `step`.
 *
 * Modelled on Python's [`range()`](https://docs.python.org/3.13/library/functions.html#func-range) built-in:
 *
 * 1. All values must be integers
 * 2. Negative values are permitted for `start`, `stop`, and `step`
 *
 * @example
 * // Iterate from the "far" corner of a grid area toward [0, 0]
 * for(const y of range(height, -1, -1)) {
 *      for(const x of range(width, -1, -1)) {
 *          console(drawTile(x,y));
 *      }
 * }
 *
 * @description
 * | Arguments          |  Example Call     | Example Yield           |
 * |--------------------|-------------------|-------------------------|
 * | `stop`             | `range(10)`       | `0`, `1`, `2`, ..., `9` |
 * | `start, stop`      | `range(5, 10)`    | `5`, `6`, `7`, ..., `9` |
 * | `start, stop, end` | `range(0, 10, 2)` | `0`, `2`, `4`, `6`, `8` |
 * 
 * @returns {Generator<Number>} - a generator yielding numbers from `start` by `step`, ending before `stop`.
 */
export function range(...rest) {
    // Validate types
    const len = rest.length;

    if(len < 1 || len > 3) throw RangeError(
        `this function takes 1 to 3 arguments, but got ${len}`);

    let problem = null;
    for(const [i, v] of rest.entries()) {
        if      (! (typeof v === 'number')) problem = TypeError;
        else if (! Number.isInteger(v))     problem = RangeError;
        if (problem) throw new problem(
            `argument ${i} is not an integer`);
    }

    // Structure the data 
    const slots = {begin: 0, end: undefined, step: 1};
    if      (len === 1) { slots.end = rest[0]; }
    else if (len >= 2) {
        slots.begin = rest[0];
        slots.end   = rest[1];
        if  (len === 3) slots.step = rest[2];
    }

    //Instantiate the generator
    return _rangeGenerator(slots);
}

/**
 * @ignore
 * @function
 * @param {Iterable<T>} iterable
 * @yields {Array<Number, T>}
 */
function* _enumerateGenerator(iterable) {
    let i = 0;
    for(const v of iterable) {
        yield [i, v];
    }
}


/**
 * @public
 * @function
 * @summary Return a generator yielding `[index, item]` pairs.
 *
 * * Modelled on Python's [`enumerate()`](https://docs.python.org/3.14/library/functions.html#enumerate)
 *   built-in
 * * If you know you will only get arrays, use their [`.entries()`][arr-entries] method
 *
 * [arr-entries]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries
 * @example
 * // Best used when you may get a generator or other uknown iterable.
 * for (const [index, item] of enumerate(someIterable)) {
 *      console.log(index, item);
 * }
 * 
 * // If you know you will *only* get an array, use its entries() method
 * for(const [index, item] of array.entries()) {
 *      console.log(index, item);
 * }

 * @param {Iterable<T>} iterable
 * @returns {Generator<Array<Number, T>>} A generator yielding `[index, value]` pairs.
 */
export function enumerate(iterable) {
    if(! hasSymbolIterator(iterable) ) throw new TypeError(
        `${JSON.stringify(iterable)} lacks a Symbol.iterator value`
    )
    return _enumerateGenerator(iterable);
}


/**
 * @ignore
 * @generator
 * @summary Internal helper which yields from `iterables` in series.
 * @param {Iterable<Iterable<T>>} iterables 
 */
function* _chainGenerator(iterables) {
    for(const it of iterables) {
        for(const item of it) {
            yield item;
        }
    }
}


/**
 * @public
 * @function
 * @summary Combine one or more iterables into one.
 *
 * Modelled on Python's [`itertools.chain()`](https://docs.python.org/3/library/itertools.html#itertools.chain).
 * @example
 * // Prints 1, 2, 3,
 * for (const item of chain([1,], [2,3])) {
 *      console.log(`${item},`);
 * }
 *
 * @param {Iterable<Iterable<T>>} iterables
 * @returns {Generator<T>} A generator which yields the passed items in order.
 */
export function chain(...iterables) {
    for(const [i, iterable] of iterables.entries()) {
        if(!hasSymbolIterator(iterable)) {
            throw new TypeError(`${i}th value does not appear iterable ${JSON.stringify(iterable) }`);
        }
    }
    return _chainGenerator(iterables);
}


/**
 * @ignore
 * @summary Pushes each item in `iterable` to `temp` before it yields it.
 * @param {Iterable<T>} iterable
 * @param {Array<T>} temp
 *
 */
function* _tempPusher(iterable, temp) {
    for(const item of iterable) {
        temp.push(item);
        yield item;
    }
}


/**
 * @ignore
 * @summary Repeats `iterable`'s contents forever.
 * @param {Iterable<T>} iterable 
 */
function* _cycleGen(iterable) {
    const temp = [];
    for(const item of _tempPusher(iterable, temp)) {
        yield item;
    }
    while(true) {
        for(const item of temp) yield item;
    }  
}


/**
 * @public
 * @function
 * @summary Repeat the passed `iterable` forever.
 *
 * Modelled on Python's [`itertools.cycle()`](https://docs.python.org/3/library/itertools.html#itertools.cycle).
 * @example
 * // The seasons repeat forever. 
 * const seasons = cycle(['Winter', 'Spring', 'Summer', 'Autumn']);
 *
 * // Don't use it with a for loop. Instead, use it as 
 * // You can call next(seasons) as many times as you want
 * const {value, done} = next(seasons)
 *
 * // Will output Winter the first time.
 * console.log(value)
 *
 * @param {Iterable<T>} iterable The iterable to repeat.
 * @returns {Generator<T>} A generator repeating the passed values forever.
 */
export function cycle(iterable) {
    if(! hasSymbolIterator(iterable)) {
        throw new TypeError(`cycle expects an iterable, but got ${JSON.stringify(iterable)}`);
    }
    return new _cycleGen(iterable);
}


/**
 * @ignore 
 * @param {*} iterable 
 * @param {*} n
 */
function* _repeatGenerator(iterable, n) {
    const temp = [];
    for(const item of _tempPusher(iterable, temp)) {
        yield item;
    }
    for(let i = 1; i < n; i++) {
        for(const item of temp) {
            yield item;
        }
    }
}


/**
 * @public
 * @function
 * @summary Repeat items from `iterable` exactly `n` times.
 *
 * @example
 * // Outputs 1, 2, 3, 1, 2, 3,
 * const array = [1, 2, 3];
 * for(const item in repeat(array, 2)) {
 *      console.log(`${item},`); 
 * }
 *
 * @param {Iterable<T>} iterable 
 * @param {Number} n - 0 or more times to repeat the iterable.
 * @returns {Generator<T>} A generator repeating `iterable`'s values `n` times.
 */
export function repeat(iterable, n) {
    if(!hasSymbolIterator(Symbol.iterator)) {
        throw new TypeError(`iterable is not an iterable`);
    }
    const problem = null;
    if(typeof n !== 'number') {
        problem = TypeError;
    } else if (n <= 0 || ! Number.isInteger(n)) {
        problem = RangeError;
    }
    if(problem) throw new problem(`n must be an integer > 0 but got ${n}`);
    return _repeatGenerator(iterable, n);
}


/**
 * @ignore
 * @function
 * @summary Internal generator function which assumes pre-validated arguments.
 * 
 * @param {Iterable<Iterable<T>>} iterables 
 * @param {boolean} strict Whether to raise an error for missing values. 
 */
function* _zipGenerator(iterables, strict = false) {
    const generators = iterables.map(asGenerator);
    const numGenerators = generators.length;
    const completed = new Set(); // Indices of completed generators

    // TODO: check done value behavior specifics? try / finally
    for(var elapsed = 0; completed.size === 0; elapsed++) {
        // Prepare an array to yield and record any iteration terminations
        const toYield = [];
        for(const [i, generator] of generators.entries()) {
            const {value, done} = generator.next();
            // TODO: consider returning undefined in the slot?
            if(done) {
                completed.add(i);
            }
            toYield.push(value);
        }

        // Terminate early or yield the value we just built
        const nDone = completed.size;
        if(nDone) {
            if(nDone < numGenerators && strict)
                throw new MismatchedLengths(`iteratables stopped early at index ${elapsed}`);
            else
                break;
        }
        else {
            yield toYield;
        }
    }
}

/**
 * @public
 * @class
 * @summary A subclass of [`RangeError`][RangeError] for when values don't have the same length.
 *
 * [RangeError]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError
 * @description
 * This is raised by {@link module:skinkjs/iteration.zipStrict|zipStrict()} and other {@link module:skinkjs/iteration|skinkjs/iteration} tools
 */
export class MismatchedLengths extends RangeError {}


/**
 * @public
 * @summary Get a generator over n-length iterables from n `iterables`.
 *
 * Like [Python's `zip()`][py-zip] without `strict=False`. For `strict=True`,
 * see the {@link module:skinkjs/iteration.zipStrict|zipStrict()} function.
 *
 * [py-zip]: https://docs.python.org/3/library/functions.html#zip
 * @example
 * // Prints: ac, be, d
 * for(const pair of zip(['a', 'b', 'c'], ['d', 'e'])) {
 *      const joined = pair.join('')
 *      console.log(`${joined},`);
 * }
 * @param  {Iterable<Iterable<T>>} iterables 
 * @returns {Generator<Array>} A generator of items.
 */
export function zip(...iterables) {
    for(const [i, iterable] of iterables.entries()) {
        if (! hasSymbolIterator(iterable)) throw TypeError(
            `argument ${i} does not appear to be iterable: ${iterable}`);
    }
    return _zipGenerator(iterables)
}


/**
 * @public
 * @function
 * @summary Like {@link module:skinkjs/iteration.zip|zip()} but raises an exception on different iterable lengths.
 *
 * Like [Python's `zip()`](https://docs.python.org/3/library/functions.html#zip)
 * with `strict=True`. For `strict=False`, see the {@link module:skinkjs/iteration.zip|zip()}
 * function.
 *
 * @param  {Iterable<Iterable<T>>} iterables 
 * @returns {Generator<Array>} - A generator of n-length arrays.
 * @throws {MismatchedLengths} When iterables differ in length.
 */
export function zipStrict(...iterables) {
    for(const [i, item] of iterables.entries()) {
        if (!hasSymbolIterator(item)) throw TypeError(
            `argument ${i} does not appear to be iterable: ${item}`);
    }
    return _zipGenerator(iterables, true)
}


/**
 * @summary A discrete-value wheel which records overflow carry distance.
 * @ignore
 * @class
 *
 * For simplicity of design:
 * 1. values are immutable-like
 * 2. this is a class
 *
 * @property {Number} carry how much the previous advance overflowed by.
 *
 */
class DigitLike {

    #values; // Values array

    #currentIndex = 0; // Index in array
    #carry = 0; // Whether the last advance wrapped under or over 

    get carry() { return this.#carry; }
    get length() { return this.#values.length; }
    get currentIndex() { return this.#currentIndex; }
    get currentValue() { return this.#values[this.#currentIndex]; }

    resetCarry() { this.#carry = 0; }

    constructor(...digitOptions) {
        if (digitOptions.length < 1) throw RangeError(
            `at least 1 digit options are required, but got ${digitOptions.length}`);
        this.#values = digitOptions;
    }

    /**
     * Advance the dial by n steps in either direction defaulting to 1.
     *
     * @param {Number} n an integer number of steps,  d
     * @returns {Number} The carry sign: -1 for underflow, 1 for overflow.
     */
    advance(n = 1) {
        if (!(Number.isInteger(n))) throw TypeError(`
            can only advance by int values, not ${n}`);

        const length = this.length;
        let nextRaw = this.#currentIndex + n;
        let carry = 0;
        // Detect carry and wrap the index back into the dial's index space
        if (nextRaw < 0) carry = -1;
        else if (length <= nextRaw) carry = 1;
        nextRaw = positiveMod(nextRaw, length);

        this.#currentIndex = nextRaw;
        this.#carry = carry;

        return carry;
    }
}

/**
 * @ignore
 */
function* _productGenerator(iterables) {
    // Prevent while-loop issues by calculating when to stop ahead of time
    var numPermutations = 1;
    for(const digitLike of iterables) numPermutations *= digitLike.length;
 
    // Yield permutations as invidual arrays by advancing each digit wheel
    for(var currentPermutation = 0; currentPermutation < numPermutations; currentPermutation++) {
        // Yield the current digit configuration
        const perm = [];
        for (const iterable of iterables) perm.push(iterable.currentValue);
        yield perm;

        // Advance the dials, stopping at the first non-carrying increment
        for(const [index, iterable] of iterables.entries()) {
            iterable.resetCarry();
            iterable.advance();
            if(! iterable.carry) break;
        }
    }
}

/**
 * @summary Get a new generator yielding all combos of items in `iterables`.
 *  
 * IMPORTANT: The passed iterables are converted to arrays for convenience.
 * @example
 * function forCoords(width, height, {xOffset: 0, yOffset: 0}) {
 *     const xGenerator = range(xOffset, xOffset + width);
 *     const yGenerator = range(yOffset, yOffset + height)
 *     for(const [x,y] of product(xGenerator, yGenerator)) {
 *          console.log(`Do your task here for [${x}, ${y}]`);
 *     }
 * }
 * 
 * @param  {Array<Iterable>} iterables The iterables to use as digits / to permute.
 * @returns {Generator<Array>} Arrays of elements from the passed iterables.
 */
export function product(...iterables) {
    if(iterables.length === 0) return EMPTY_GENERATOR;

    // Convert the iterables to dial-like automodulo-ing helpers
    const digits = [];
    for(const [i, iterable] of iterables.entries()) {
        // inlined for speed
        if ((iterable === undefined)
            || (iterable === null)
            || (typeof iterable[Symbol.iterator] !== 'function')
        ) throw TypeError(
            `argument ${i} does not appear to be iterable: ${JSON.stringify(iterable)}`);

         const digit = new DigitLike(...iterable);
         digits.push(digit);
    }

    return _productGenerator(digits);
}

/**
 * @summary Core functions available via `skink.iteration` globally.
 *
 * @object
 */
export const iteration = {
    chain: chain,
    cycle: cycle,
    enumerate: enumerate,
    product: product,
    range: range,
    repeat: repeat,
    zip: zip,
    zipStrict: zipStrict,
    EMPTY_GENERATOR: EMPTY_GENERATOR,
    asGenerator: asGenerator,
    hasSymbolIterator: hasSymbolIterator,
}
