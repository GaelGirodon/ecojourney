import assert from "node:assert/strict";
import { format as _ } from "node:util";
import { omit, pick } from "./object.js";

describe("object", () => {
    describe("#pick()", () => {
        for (const t of [
            { object: {}, keys: [], output: {} },
            { object: { a: 1, b: 2 }, keys: ["a"], output: { a: 1 } },
            { object: { a: 1, b: 2 }, keys: ["a", "c"], output: { a: 1 } },
            { object: { a: 1, b: undefined, c: 3 }, keys: ["a", "b"], output: { a: 1, b: undefined } }
        ]) {
            it(_("should return %O when picking keys %O from %O", t.output, t.keys, t.object), () => {
                assert.deepEqual(pick(t.object, t.keys), t.output);
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
                assert.deepEqual(omit(t.object, t.keys), t.output);
            });
        }
    });
});
