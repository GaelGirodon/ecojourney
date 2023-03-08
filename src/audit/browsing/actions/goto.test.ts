import assert from "node:assert/strict";
import { GotoAction } from "./goto.js";

describe("GotoAction", () => {
    describe("#constructor()", () => {
        for (const t of [
            { type: "array", props: ["url"], url: "url" },
            { type: "object", props: { url: "url" }, url: "url" }
        ]) {
            it(`should create an action with props as ${t.type}`, () => {
                const action = new GotoAction(t.props);
                assert.equal(action.url, t.url);
            });
        }
    });
});
