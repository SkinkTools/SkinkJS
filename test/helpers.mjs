/**
 * Various library-wide test helpers.
 */

import { skip } from "vitest";

const versionNumber = []

export const NOT_ITERABLES = [
    1,
    true,
    undefined
];

export const NOT_NUMBERS = [
    true,
    null,
    undefined,
    [],
    "Not a number"
];


export const IT_SOURCES = [
    function set(iterable = undefined) { return new Set(iterable); },
    function array(iterable = undefined) { return Array.from(iterable); },
    function generator(iterable) { return (function*(it){
        for(const item of it) yield item;
    })(iterable); }
];


export function ensureNumber() {
    if (versionNumber.length) return;
    versionNumber.push(...((process.version
        .split('.')
        .map(Number)
    )));
}

export function nodeVersionIsGt(...rest) {
    ensureNumber();
    for (var i = 0; i < rest.length; i++) {
        if (versionNumber[i] > rest[i]) return true;
    }
    return false;
}

export function skipIfNodeVersionGt(...rest) {
    if(nodeVersionIsGt(...rest)) skip();
}
