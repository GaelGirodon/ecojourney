import assert from "node:assert";
import { ProcedureAction } from "./procedure.js";

describe("ProcedureAction", () => {
    describe("#constructor()", () => {
        for (const t of [
            { type: "array", props: ["name"], name: "name", args: {} },
            { type: "object", props: { name: "name", args: { key: "value" } }, name: "name", args: { key: "value" } }
        ]) {
            it(`should create an action with props as ${t.type}`, () => {
                const action = new ProcedureAction("", t.props);
                assert.strictEqual(action.name, t.name);
                assert.deepStrictEqual(action.args, t.args);
            });
        }
    });
});
