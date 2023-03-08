import assert from "node:assert";
import { cli, programName } from "./cli.js";

describe("cli", () => {
    describe("#cli()", () => {
        it("should build the CLI", () => {
            const p = cli();
            assert.strictEqual(p.name(), programName);
            assert.strictEqual(p.description(), "Eco-design website audit tool");
            assert.strictEqual(p.commands.length, 2);
        });
    });
});
