import assert from "node:assert/strict";
import { PageAction } from "./page.js";

describe("PageAction", () => {
    describe("#constructor()", () => {
        for (const t of [
            { type: "array", props: ["name"], name: "name" },
            { type: "object", props: { name: "name" }, name: "name" }
        ]) {
            it(`should create an action with props as ${t.type}`, () => {
                const action = new PageAction("", t.props);
                assert.equal(action.name, t.name);
            });
        }
    });
});
