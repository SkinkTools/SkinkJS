import { product, range } from "../src/core/functional/iteration.mjs";
import { NOT_ITERABLES } from "./helpers.mjs";

import {assert, describe, expect, it} from "vitest";


describe('throws TypeError on non-iterable arguments', () => {

    for(const i of range(3)) {
        it(`it throws TypeError for non-number as argument ${i}`, () => {
            for (const bad of NOT_ITERABLES) {
                const local = [];
                for(const inner of range(3)) local.push([inner,]);
                local[i] = bad;
                expect(() => product(...local)).toThrow(TypeError);
            }
        });
    }
});


it('yields nothing if no iterables provided', () => {
    const result = Array.from(product());
    expect(result.length).toEqual(0);
});

describe('yields series of 1-length arrays when given 1 iterable', () => {

for(const factory of [range, function array(n) {return Array.from(range(n))},  function set(n) {return new Set(range(n));}]) {

    it(`it does so for ${factory.name}`, () => {
        for(const iterLength of [1, 50, 100]) {
                var i = 0 ;
                const iterable = factory(iterLength);
                for (const value of product(iterable)) {
                    // TODO: carefully evaluate this?
                    expect(value).toEqual([i,]);
                i++;
                }
        }

    });
    }
});

describe('no dupes when each iterable has unique values', () => {
    for(const n of range(1, 4)) {
        const nResults = Math.pow(n,n);
        // Make n x n array
        const args = []
        for(const i of range(n))
            args.push(Array.from(range(n)));

        it(`produces ${nResults} unique value for n=${n} iterables, each length=${n}`, () => {
            const s = new Set(product(...args));
            assert(s.size === nResults);
        });
    }
})