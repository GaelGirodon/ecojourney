import assert from "node:assert";
import { format as _ } from "node:util";
import { omit, pick } from "./object.js";

describe("object", () => {
    describe("#pick()", () => {
        for (const t of [
            { object: {}, props: [], output: {} },
            { object: { a: 1, b: 2 }, props: ["a"], output: { a: 1 } },
            { object: { a: 1, b: 2 }, props: ["a", "c"], output: { a: 1 } },
            { object: { a: 1, b: undefined, c: 3 }, props: ["a", "b"], output: { a: 1, b: undefined } }
        ]) {
            it(_("should return %O when picking properties %O from %O", t.output, t.props, t.object), () => {
                assert.deepStrictEqual(pick(t.object, t.props), t.output);
            });
        }
    });

    describe("#omit()", () => {
        for (const t of [
            { object: {}, props: [], output: {} },
            { object: { a: 1, b: 2 }, props: ["b"], output: { a: 1 } },
            { object: { a: 1, b: 2 }, props: ["c"], output: { a: 1, b: 2 } }
        ]) {
            it(_("should return %O when omitting properties %O from %O", t.output, t.props, t.object), () => {
                assert.deepStrictEqual(omit(t.object, t.props), t.output);
            });
        }
    });
});
