/**
 * Various library-wide test helpers.
 */

import { skip } from "vitest";

const versionNumber = []

export const IterableFactories = {
    set(iterable = undefined) { return new Set(iterable); },
    array(iterable = undefined) { return Array.from(iterable); },
    *generator(iterable) {
        for(const item of iterable) yield item;
    }
};

export function makeIterables(raw = undefined, which = {set : true, array : true, generator : true}) {
    const out = [];
    for(const k of Object.keys(which)) {
        const f = IterableFactories[k]
        out.push(f(raw));
    }
    return out;
}

export const NOT_ITERABLES = [
    1,
    true,
    undefined
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
