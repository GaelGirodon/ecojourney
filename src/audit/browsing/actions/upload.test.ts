import assert from "node:assert/strict";
import { UploadAction } from "./upload.js";

describe("UploadAction", () => {
    describe("#constructor()", () => {
        for (const t of [
            { type: "array", props: [".s", "f1.txt"], selector: ".s", files: ["f1.txt"] },
            { type: "object", props: { selector: ".s", file: "f1.txt" }, selector: ".s", files: ["f1.txt"] },
            { type: "object (2)", props: { selector: ".s", files: ["f1.txt", "f2.txt"] }, selector: ".s", files: ["f1.txt", "f2.txt"] }
        ]) {
            it(`should create an action with props as ${t.type}`, () => {
                const action = new UploadAction(t.props);
                assert.equal(action.selector, t.selector);
                assert.deepEqual(action.files, t.files);
            });
        }
    });
});
