/**
 * @module skinkjs/operators
 * 
 * @description Operators akin to [Python's `operator`][py-op] module.
 *
 * 
 * [py-op]: https://docs.python.org/3/library/operator.html
 */


/**
 * @summary `a + b`
 *
 * @public
 * @function
 * @param {Number} a
 * @param {Number} b  
 * @returns {Number}
 */
export const add = (a, b) => a + b;
/**
 * @summary `a - b`
 * @public
 * @function
 * @param {Number} a
 * @param {Number} b  
 * @returns {Number}
 */
export const subtract = (a, b) => a - b;
/**
 * @summary `a * b`
 * @public
 * @function
 * @param {Number} a
 * @param {Number} b  
 * @returns {Number}
 */
export const multiply = (a, b) => a * b;
/**
 * @summary `a / b`
 * @public
 * @function
 * @param {Number} a
 * @param {Number} b  
 * @returns {Number}
 */
export const divide   = (a ,b) => a / b;
/**
 * @summary Get the remainder of dividing `a` by `b`.
 *
 * For a modulo function which wraps into positive values, see
 * {@link module:skinkjs/operators.positiveMod|positiveMod()}).
 *
 * @public
 * @function
 * @param {Number} a
 * @param {Number} b  
 * @returns {Number}
 */
export const mod      = (a, b) => a % b;


/**
 * @summary `%` which wraps back into the positive domain. For no-wrap, see {@link module:skinkjs/operators.mod|mod()} or [JavaScript's `%`][mdn-mod].
 *
 * [mdn-mod]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
 * @public
 * @function
 * @example
 * // The JS `%` operator doesn't do this by default:
 * const a = positiveMod(-4, 2)
 *
 * @param {Number} a - the operand
 * @param {Number} b - the mod base
 * @returns {Number} - the positive-domain mod
 */
export function positiveMod(a, b) {
    let result = a % b;
    // Although -0 does exist in JS, it's covered here.
    while(result < 0) result += b;
    return result;
}

/**
 * @summary Exposed as `skink.operators` in global scope and holds members below.
 * 
 *  
 * @object
 */
export const operators = {
    add: add,
    subtract: subtract,
    multiply: multiply,
    divide: divide,
    mod: mod,
    positiveMod: positiveMod,
};

