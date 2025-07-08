import { enumerate } from "../src/iteration.mjs";
import { assert, describe, it, expect } from "vitest";
import { NOT_ITERABLES, NOT_NUMBERS } from "./helpers.mjs";

describe(enumerate, () => {
    describe('rejects non-iterables', () => {
        for(const bad of NOT_ITERABLES) {
            it(`rejects ${JSON.stringify(bad)}`, () => {
                expect(() => { enumerate(bad); }).toThrow(TypeError);
            });
        }
    });
    describe('rejects non-integer values of start', () => {
            for(const b of NOT_NUMBERS) {
                if(b === undefined) continue; // "undefined" isn't detected, elides out.
                it(`rejects non-Number ${b}`, () => {
                 expect(() => enumerate([1,2], b)).toThrow(TypeError);
                });
            }
        it('rejects non-integers', () => {
            for(const f of [-1.2, 1.1]) {
                expect(() => enumerate([1,2], f)).toThrow(RangeError);
            }
        });
    });
    describe('returns an appropriate generator', () => {
        
        it('accepts negative start ints', () => {
            const it = enumerate([0,1,2], -3)
            function nextItValIs(index, iterableValue) {
                const {value, done} = it.next();
                const [resultIndex, resultValue] = value;
                assert(resultIndex === index);
                assert(resultValue === iterableValue);
            }
            nextItValIs(-3,0);
            nextItValIs(-2,1);
            nextItValIs(-1,2);
        });
        const result = enumerate(
            (function*() { yield 1; })()
        );
        it('has a next function', () => {
            assert(typeof result['next'] === 'function');
        });
        it('returns values', () => {
            const localResult = Array.from(result);
            for(let i = 0; i < 1; i++) {
               localResult[i] == i;
              
            }
        });
    });
});