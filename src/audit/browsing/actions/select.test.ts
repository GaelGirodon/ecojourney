import assert from "node:assert/strict";
import { SelectAction } from "./select.js";

describe("SelectAction", () => {
    describe("#constructor()", () => {
        for (const t of [
            { type: "array", props: [".s", "v1"], selector: ".s", values: ["v1"] },
            { type: "object", props: { selector: ".s", value: "v1" }, selector: ".s", values: ["v1"] },
            { type: "object (2)", props: { selector: ".s", values: ["v1", "v2"] }, selector: ".s", values: ["v1", "v2"] }
        ]) {
            it(`should create an action with props as ${t.type}`, () => {
                const action = new SelectAction(t.props);
                assert.equal(action.selector, t.selector);
                assert.deepEqual(action.values, t.values);
            });
        }
    });
});
