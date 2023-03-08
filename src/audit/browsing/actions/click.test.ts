import assert from "node:assert/strict";
import { ClickAction } from "./click.js";

describe("ClickAction", () => {
    describe("#constructor()", () => {
        for (const t of [
            { type: "array", props: [".s"], selector: ".s" },
            { type: "object", props: { selector: ".s" }, selector: ".s" }
        ]) {
            it(`should create an action with props as ${t.type}`, () => {
                const action = new ClickAction("", t.props);
                assert.equal(action.selector, t.selector);
            });
        }
    });
});
