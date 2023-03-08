import assert from "node:assert";
import { bytes, round, seconds } from "./units.js";

describe("units", () => {
    describe("#bytes()", () => {
        for (const t of [
            { value: 1, output: "1 B" },
            { value: 9876, output: "9.88 kB" },
            { value: 1234567, output: "1.23 MB" },
            { value: 9876543210, output: "9.88 GB" },
            { value: 1234567890123, output: "1.23 TB" }
        ]) {
            it(`should return ${t.output} for value ${t.value}`, () => {
                assert.strictEqual(bytes(t.value), t.output);
            });
        }
    });

    describe("#seconds()", () => {
        for (const t of [
            { value: 1, output: "1 s" },
            { value: 0.1, output: "100 ms" },
            { value: 0.01, output: "10 ms" },
            { value: 0.001, output: "1 ms" }
        ]) {
            it(`should return ${t.output} for value ${t.value}`, () => {
                assert.strictEqual(seconds(t.value), t.output);
            });
        }
    });

    describe("#round()", () => {
        for (const t of [
            { value: 1, scale: 2, output: 1 },
            { value: 1.2345, scale: 2, output: 1.23 },
            { value: 1.23, scale: 0, output: 1 },
            { value: 9.8765, scale: 2, output: 9.88 }
        ]) {
            it(`should return ${t.output} for value ${t.value}`, () => {
                assert.strictEqual(round(t.value, t.scale), t.output);
            });
        }
    });
});
