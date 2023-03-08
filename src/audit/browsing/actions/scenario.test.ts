import assert from "node:assert";
import { ScenarioAction } from "./scenario.js";

describe("ScenarioAction", () => {
    describe("#constructor()", () => {
        for (const t of [
            { type: "array", props: ["name"], name: "name", newContext: false, exclude: false },
            { type: "object", props: { name: "name" }, name: "name", newContext: false, exclude: false },
            { type: "object (2)", props: { name: "name", newContext: true }, name: "name", newContext: true, exclude: false },
            { type: "object (3)", props: { name: "name", exclude: true }, name: "name", newContext: false, exclude: true },
            { type: "object (4)", props: { name: "name", newContext: true, exclude: true }, name: "name", newContext: true, exclude: true },
            { type: "object (5)", props: { name: "name", newContext: "true", exclude: "true" }, name: "name", newContext: true, exclude: true }
        ]) {
            it(`should create an action with props as ${t.type}`, () => {
                const action = new ScenarioAction("", t.props);
                assert.strictEqual(action.name, t.name);
                assert.strictEqual(action.newContext, t.newContext);
                assert.strictEqual(action.exclude, t.exclude);
            });
        }
    });
});
