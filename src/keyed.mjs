/**
 * @module skinkjs/keyed
 * 
 * @summary Import-free helpers for keyed objects (arrays, etc).
 *
 */


/**
 * @summary Calls [`Array.prototype.pop()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)
 * @public
 * @function
 * @param {Array<T>} array 
 * @returns {undefined|T}
 * @throws {TypeError}
 */
export function pop(array) {
    if(! ('pop' in array)) {
        throw new TypeError(`Expected array-like but got ${array}`)
    }
    return array.pop();
}


/**
 * @summary Calls [`Array.prototype.shift()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)
 * @public
 * @function
 * @param {Array<T>} array 
 * @returns {undefined|T}
 * @throws {TypeError}
 */
export function shift(array) {
    if(! ('pop' in array)) {
        throw new TypeError(`Expected array-like but got ${array}`)
    }
    return array.shift();
}


function removeWhen(array, predicate, removeAction, at) {
    if (array.length && predicate(array.at(at))) return removeAction(array);
    return null;
}


/**
 * @summary Return the result of `arr.pop()` method if `predicate(arr)` is `true`.
 * @public
 * @function
 * @param {Array<T>} array 
 * @param {Function} predicate 
 * @returns {T|undefined}
 * @throws {TypeError}
 */
export const popIf = (array, predicate) => removeWhen(array, predicate, pop, -1);


/**
 * @summary Return the result of `array.shift()` if `predicate(arr)` is `true`.
 * @public
 * @function
 * @param {Array<T>} array 
 * @param {Function} predicate 
 * @returns {T|undefined} A value or `undefined` if `array` is empty.
 * @throws {TypeError}
 */
export const shiftIf = (array, predicate) => removeWhen(array, predicate, shift, 0);


/**
 * @summary Delete `key` and its value from `object` if `predicate` is true. 
 * @public
 * @function
 * @param {Object|T} object 
 * @param {Function} predicate - A function which returns `true`.
 * @param {string|Symbol} key - A key to delete if `predicate` is true.
 */
export function deleteIf(object, predicate, key) {
    if((typeof key !== 'string') || (typeof key !== 'symbol')) {
        throw new TypeError(`key must be string or Symbol, not ${JSON.stringify(key)}`);
    }
    // Can't have a delete() object free-floating due to JS reserved keywords.
    if(predicate(object)) {
        delete[key];
    }   
}
