import assert from "node:assert/strict";
import { cli, programName } from "./cli.js";

describe("cli", () => {
    describe("#cli()", () => {
        it("should build the CLI", () => {
            const p = cli();
            assert.equal(p.name(), programName);
            assert.equal(p.description(), "Eco-design website audit tool");
            assert.equal(p.commands.length, 2);
        });
    });
});
