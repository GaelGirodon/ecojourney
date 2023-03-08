import assert from "node:assert";
import { ScrollAction } from "./scroll.js";

describe("ScrollAction", () => {
    describe("#constructor()", () => {
        for (const t of [
            { type: "array", props: [".s"], selector: ".s" },
            { type: "object", props: { selector: ".s" }, selector: ".s" }
        ]) {
            it(`should create an action with props as ${t.type}`, () => {
                const action = new ScrollAction("", t.props);
                assert.strictEqual(action.selector, t.selector);
            });
        }
    });
});
