import assert from "node:assert/strict";
import { CheckAction } from "./check.js";

describe("CheckAction", () => {
    describe("#constructor()", () => {
        for (const t of [
            { type: "array (short/selector)", props: ["#s"], selector: "#s", state: "check" },
            { type: "array (short/check)", props: ["#s", "check"], selector: "#s", state: "check" },
            { type: "array (short/uncheck)", props: ["#s", "uncheck"], selector: "#s", state: "uncheck" },
            { type: "object (long/selector)", props: { selector: "#s" }, selector: "#s", state: "check" },
            { type: "object (long/check)", props: { selector: "#s", state: "check" }, selector: "#s", state: "check" },
            { type: "object (long/uncheck)", props: { selector: "#s", state: "uncheck" }, selector: "#s", state: "uncheck" }
        ]) {
            it(`should create an action with props as ${t.type}`, () => {
                const action = new CheckAction(t.props);
                assert.equal(action.selector, t.selector);
                assert.equal(action.state, t.state);
            });
        }
    });
});
