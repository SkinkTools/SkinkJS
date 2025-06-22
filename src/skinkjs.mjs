/**
 * @package
 */

/**
 * @global
 * @description The global `skink` object is exposed for non-module users.
 *
 * | ℹ️ [Step-by-step instructions](../#step-by-step) are available for users new to HTML or JavaScript. |
 * |:---------------------------------------------------------------------------------------------------:|
 *
 * It holds a namespace object equivalent to each module.
 *
 * | Module                            |  Namespace equivalent | Unpacking example                             |
 * |-----------------------------------|-----------------------|-----------------------------------------------|
 * | {@link module:skinkjs/dom}        | `skink.dom`           | `const {tag, query} = skink.dom;`             |
 * | {@link module:skinkjs/iteration}  | `skink.iteration`     | `const {range, enumerate} = skink.iteration;` |
 * | {@link module:skinkjs/operators}  | `skink.operator`      | `const {add, subtract} = skink.operator;`     |
 * | {@link module:skinkjs/keyed}      | `skink.keyed`         | `const {pop, shift} = skink.keyed;`           |
 *
 * #### Brief Overview
 *
 * For full instructions, see the [step-by-step](../#step-by-step) guide.
 *
 * To use items in JavaScript:
 * 1. Find their name in the module doc (i.e.
 *    {@link module:skinkjs/iteration|iteration} or {@link module:skinkjs/dom|dom})
 * 2. Unpack it via destructuring
 *
 * For example, to use the {@link module:skinkjs/iteration:range|range} function:
 * ```javascript
 * const {range} = skink.iteration;
 * ```
 *
 * To use items from {@link module:skinkjs/dom|skink.dom}, the approach is the same:
 * ```javascript
 * const {tag} = skink.dom;
 * ```
 *
 */
export const skink = {};
globalThis.skink = skink;


// Awful, awful import tricks to make sure it works.
// TODO: try to put this in a webpack config?
import { keyed } from "./keyed.mjs";
skink.keyed = keyed;
import {operators } from "./operators.mjs";
skink.operators = operators;
import {iteration} from "./iteration.mjs";
skink.iteration = iteration;
import {dom} from "./dom.mjs";
skink.dom = dom;