import assert from "node:assert/strict";
import { format as _ } from "node:util";
import { groupReduce, isObject, merge, omit, pick } from "./object.js";

describe("object", () => {
    describe("#isObject()", () => {
        for (const t of [
            { input: undefined, output: false },
            { input: null, output: false },
            { input: "", output: false },
            { input: "a-string", output: false },
            { input: [1, 2, 3], output: false },
            { input: {}, output: true },
            { input: new Object(), output: true },
            { input: new Map(), output: true }
        ]) {
            it(_("should return %O for %O", t.output, t.input), () => {
                assert.equal(isObject(t.input), t.output);
            });
        }
    });

    describe("#pick()", () => {
        for (const t of [
            { object: {}, keys: [], output: {} },
            { object: { a: 1, b: 2 }, keys: ["a"], output: { a: 1 } },
            { object: { a: 1, b: 2 }, keys: ["a", "c"], output: { a: 1 } },
            { object: { a: 1, b: undefined, c: 3 }, keys: ["a", "b"], output: { a: 1, b: undefined } }
        ]) {
            it(_("should return %O when picking keys %O from %O", t.output, t.keys, t.object), () => {
                assert.deepEqual(pick(t.object, t.keys as any), t.output);
            });
        }
    });

    describe("#omit()", () => {
        for (const t of [
            { object: {}, keys: [], output: {} },
            { object: { a: 1, b: 2 }, keys: ["b"], output: { a: 1 } },
            { object: { a: 1, b: 2 }, keys: ["c"], output: { a: 1, b: 2 } }
        ]) {
            it(_("should return %O when omitting keys %O from %O", t.output, t.keys, t.object), () => {
                assert.deepEqual(omit(t.object, t.keys as any), t.output);
            });
        }
    });

    describe("#merge()", () => {
        it("should merge objects deeply", () => {
            const objects = [
                { a: 1, b: { c: 2, d: { e: 3 } }, f: 4 },
                { a: [11] },
                { b: { c: 22 } },
                { b: { d: { e: { g: 44 } } } }
            ];
            const expected = { a: [11], b: { c: 22, d: { e: { g: 44 } } }, f: 4 };
            assert.deepEqual(merge(...objects), expected);
        });
    });

    describe("#groupReduce()", () => {
        it("should group and reduce elements", () => {
            const collection = [
                { name: "A", value: 1 },
                { name: "B", value: 2 },
                { name: "A", value: 3 },
                { name: "C", value: 4 }
            ];
            const expected = {
                "A": [1, 3],
                "B": [2],
                "C": [4]
            };
            const actual = groupReduce(collection, e => e.name, () => [],
                (p: number[], e) => [...p, e.value]);
            assert.deepEqual(actual, expected);
        });
    });
});
