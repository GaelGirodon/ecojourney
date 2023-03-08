import assert from "node:assert/strict";
import { capitalise, slugify, trimEndDot, uncapitalise } from "./string.js";

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
            it(`should return '${t.output}' for '${t.str}'`, () => {
                assert.equal(capitalise(t.str!), t.output);
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
            it(`should return '${t.output}' for '${t.str}'`, () => {
                assert.equal(uncapitalise(t.str!), t.output);
            });
        }
    });

    describe("#slugify()", () => {
        for (const t of [
            { str: undefined, output: "" },
            { str: null, output: "" },
            { str: "", output: "" },
            { str: "a-page-name", output: "a-page-name" },
            { str: "A page name", output: "a-page-name" },
            { str: "A page name!", output: "a-page-name" },
            { str: "📄 Page à analyser ?", output: "page-analyser" }
        ]) {
            it(`should return '${t.output}' for '${t.str}'`, () => {
                assert.equal(slugify(t.str!), t.output);
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
            it(`should return '${t.output}' for '${t.str}'`, () => {
                assert.equal(trimEndDot(t.str!), t.output);
            });
        }
    });
});
