import assert from "node:assert/strict";
import { Option } from "./cli.js";

describe("cli", () => {
    describe("Option", () => {
        it("should support a custom attribute name", () => {
            const opt = new Option("-o, --option [options...]");
            assert.equal(opt.attributeName(), "option");
            opt.attributeName("options");
            assert.equal(opt.attributeName(), "options");
        });
    });
});
