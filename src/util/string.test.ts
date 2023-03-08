import assert from "node:assert";
import { capitalise, trimEndDot, uncapitalise } from "./string.js";

describe("string", () => {
    describe("#capitalise()", () => {
        for (const t of [
            { str: undefined, output: undefined },
            { str: null, output: null },
            { str: "", output: "" },
            { str: "12345", output: "12345" },
            { str: "capitalise", output: "Capitalise" },
            { str: "Capitalise", output: "Capitalise" },
            { str: "CAPITALISE", output: "CAPITALISE" }
        ]) {
            it(`should return "${t.output}" for string "${t.str}"`, () => {
                assert.strictEqual(capitalise(t.str!), t.output);
            });
        }
    });

    describe("#uncapitalise()", () => {
        for (const t of [
            { str: undefined, output: undefined },
            { str: null, output: null },
            { str: "", output: "" },
            { str: "12345", output: "12345" },
            { str: "Uncapitalise", output: "uncapitalise" },
            { str: "uncapitalise", output: "uncapitalise" },
            { str: "UNCAPITALISE", output: "uNCAPITALISE" }
        ]) {
            it(`should return "${t.output}" for string "${t.str}"`, () => {
                assert.strictEqual(uncapitalise(t.str!), t.output);
            });
        }
    });

    describe("#trimEndDot()", () => {
        for (const t of [
            { str: undefined, output: undefined },
            { str: null, output: null },
            { str: "", output: "" },
            { str: "No dot", output: "No dot" },
            { str: "One dot.", output: "One dot" },
            { str: "Multiple dots...", output: "Multiple dots" }
        ]) {
            it(`should return "${t.output}" for string "${t.str}"`, () => {
                assert.strictEqual(trimEndDot(t.str!), t.output);
            });
        }
    });
});
