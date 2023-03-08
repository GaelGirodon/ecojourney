import assert from "node:assert/strict";
import { WaitAction } from "./wait.js";

describe("WaitAction", () => {
    describe("#constructor()", () => {
        for (const t of [
            { type: "array", props: ["load"], state: "load", selector: "" },
            { type: "array (2)", props: [".s"], state: undefined, selector: ".s" },
            { type: "object", props: { state: "load" }, state: "load", selector: "" },
            { type: "object (2)", props: { selector: ".s" }, state: undefined, selector: ".s" }
        ]) {
            it(`should create an action with props as ${t.type}`, () => {
                const action = new WaitAction("", t.props);
                assert.equal(action.state, t.state);
                assert.equal(action.selector, t.selector);
            });
        }
    });
});
