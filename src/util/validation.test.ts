import assert from "node:assert/strict";
import { isHttpUrl } from "./validation.js";

describe("validation", () => {
    describe("#isHttpUrl()", () => {
        for (const t of [
            { value: "n0tAnURL!", valid: false },
            { value: "ssh://url/but/not/http", valid: false },
            { value: "http://valid", valid: true },
            { value: "https://valid", valid: true }
        ]) {
            it(`should consider ${t.value} as ${t.valid ? "" : "in"}valid`, () => {
                assert.equal(isHttpUrl(t.value), t.valid);
            });
        }
    });
});
