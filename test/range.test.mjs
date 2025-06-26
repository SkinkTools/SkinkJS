import { range } from "../src/iteration.mjs";
import { describe, expect, it } from 'vitest';
import { NOT_NUMBERS } from "./helpers.mjs";


describe(range, () => {
    describe('validation behavior', () => {
        describe('rejects floats', () => {
            const args = [1.1];
            for(; args.length <= 3; args.push(1.1)) {
                const plural = (args.length > 1)
                    ? 's'
                    : '';
                it(`rejects ${args.length} float${plural}`, () => {
                    expect(
                        () => { range(1.1)}
                    ).toThrow(RangeError);
                });
            }
        });

        describe(`it throws TypeError for any non-Numbers`, () => {
            for(let i = 0; i < 3; i++) {
                // IMPORTANT: Keep this separate since the execution for
                // test code seems to be deferred till *after* loops!
                // i.e. there'll only be [1,1,1,${bad}] instead
                const argsOfLen = [];
                for(; argsOfLen.length < i; argsOfLen.push(1));
                describe(`rejects non-number in position ${i}`, () => {
                    for(const bad of NOT_NUMBERS) {
                        const fullArgs = [...argsOfLen, bad];
                        it(`rejects ${JSON.stringify(fullArgs)}`, () => {
                            expect(() => range(...fullArgs)).toThrow(TypeError);
                        });
                    }
                });
            }
        });
    });

    describe('single argument treated as end', () => {
        for (var i = 0; i < 5; i++) {
            it(`generates ${i} values starting at 0`, () => {
                const arr = Array.from(range(i));
                const len = arr.length;
                expect(len).toEqual(i);
                const minusOne = len - 1;
                expect(arr[minusOne]).toEqual(minusOne);
            })
        }
    });

})