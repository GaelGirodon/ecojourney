import assert from "node:assert";
import { format as _ } from "node:util";
import { parseHttpHeader } from "./config.js";

describe("config", () => {
    describe("#parseHttpHeader()", () => {
        for (const t of [
            { kv: "X-User: username", output: ["X-User", "username"] },
            { kv: "Authorization: Basic xxxx", output: ["Authorization", "Basic xxxx"] }
        ]) {
            it(_("should parse '%s'", t.kv), () => {
                assert.deepStrictEqual(parseHttpHeader(t.kv), t.output);
            });
        }

        for (const t of [
            { kv: "", output: [] },
            { kv: "X-Invalid=Separator", output: [] }
        ]) {
            it(_("should throw for '%s'", t.kv), () => {
                assert.throws(() => parseHttpHeader(t.kv));
            });
        }
    });
});
