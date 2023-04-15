import assert from "node:assert/strict";
import { count } from "./util.js";

describe("util", () => {
    describe("#count()", () => {
        for (const t of [
            { str: "", substr: "", limit: undefined, count: 0 },
            { str: "test", substr: "", limit: undefined, count: 0 },
            { str: "", substr: "t", limit: undefined, count: 0 },
            { str: "test", substr: "t", limit: undefined, count: 2 },
            { str: "tttt", substr: "t", limit: undefined, count: 4 },
            { str: "test*test", substr: "t", limit: 2, count: 2 }
        ]) {
            it(`should count ${t.count} '${t.substr}' in '${t.str}'`, () => {
                assert.equal(count(t.str, t.substr, t.limit), t.count);
            });
        }
    });
});
