import assert from "node:assert";
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
                assert.strictEqual(isHttpUrl(t.value), t.valid);
            });
        }
    });
});
