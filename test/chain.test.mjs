import { chain } from "../src/iteration.mjs";
import { assert, describe, it, expect } from "vitest";
import { NOT_ITERABLES } from "./helpers.mjs";

describe(chain, () => {
    describe('rejects non-iterables', () => {
        for(let n = 0; n < 3; n++) {
            const args = [];
            for(let i = 0; i < n; i++) {
                args.push([i]);
            }
            for(const bad of NOT_ITERABLES) {
                const variant = [...args, bad];
                it(`rejects ${JSON.stringify(variant)}`, () => {
                   expect(() => { chain(...variant); }).toThrow(TypeError);
                });
            }
        }
    });
    describe('returns an appropriate generator', () => {
        
        const result = chain(
            [0],
            (function*() { yield 1; })()
        );
        
        it('has a next function', () => {
            assert(typeof result['next'] === 'function');
        });
        it('returns values', () => {
            const localResult = Array.from(result);
            for(let i = 0; i < 2; i++) {
               localResult[i] == 1;
            }
        });
    });
});