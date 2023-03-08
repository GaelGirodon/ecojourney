import assert from "node:assert";
import { FillAction } from "./fill.js";

describe("FillAction", () => {
    describe("#constructor()", () => {
        for (const t of [
            { type: "array", props: [".s", "v"], selector: ".s", value: "v" },
            { type: "object", props: { selector: ".s", value: "v" }, selector: ".s", value: "v" }
        ]) {
            it(`should create an action with props as ${t.type}`, () => {
                const action = new FillAction("", t.props);
                assert.strictEqual(action.selector, t.selector);
                assert.strictEqual(action.value, t.value);
            });
        }
    });
});
