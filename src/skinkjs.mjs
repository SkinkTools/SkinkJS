/**
 * @package
 *
 */

export const skink = {};
globalThis.skink = skink;

// Awful, awful import tricks to make sure it works.
import { keyed } from "./keyed.mjs";
skink.keyed = keyed;
import {operators } from "./operators.mjs";
skink.operators = operators;
import {iteration} from "./iteration.mjs";
skink.iteration = iteration;
