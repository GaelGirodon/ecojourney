import assert from "node:assert";
import { ScreenshotAction } from "./screenshot.js";

describe("ScreenshotAction", () => {
    describe("#constructor()", () => {
        for (const t of [
            { type: "array", props: ["img.png"], path: "img.png" },
            { type: "object", props: { path: "img.png" }, path: "img.png" }
        ]) {
            it(`should create an action with props as ${t.type}`, () => {
                const action = new ScreenshotAction("", t.props);
                assert.strictEqual(action.path, t.path);
            });
        }
    });
});
