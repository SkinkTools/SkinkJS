/**
 * @module skinkjs/core/functional/operators
 * 
 * @summary Operators akin to Python's operator module.
 * 
 * It's not a 1-to-1 port because JavaScript:
 *  
 * 1. does not support operator overloading
 * 2. has different naming conventions
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
 * @summary `a % b` without wrapping into positive (@see(positiveMod)).
 * @public
 * @function
 * @param {Number} a
 * @param {Number} b  
 * @returns {Number}
 */
export const mod      = (a, b) => a % b;


/**
 * @summary `%` which wraps back into the positive domain.
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

