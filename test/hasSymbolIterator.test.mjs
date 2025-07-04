import { hasSymbolIterator } from "../src/iteration.mjs";
import { describe, it, expect } from "vitest";
import { NOT_ITERABLES, IT_SOURCES } from "./helpers.mjs";

describe(hasSymbolIterator, () => {
    describe('returns false for non-iterables', () => {

        for(const nonIterable of NOT_ITERABLES) {
            it(`returns false for ${JSON.stringify(nonIterable)}`, () => {
                expect(
                    hasSymbolIterator(nonIterable)
                ).toBe(false);
            });
        }
    })
    describe('returns true for iterables', () => {
        const iterables = Object.values(IT_SOURCES).map((s) => s([]));
        for(const value of iterables) {
            it(`returns true for ${JSON.stringify()}`, () => {
                expect(hasSymbolIterator(value)).toBe(true);
            });
        }
    });
});