import assert from "node:assert/strict";
import { format as _ } from "node:util";
import { Config, loadConfig, parseHttpHeaders } from "./config.js";

describe("config", () => {
    describe("#loadConfig()", () => {
        it("should build the configuration", async () => {
            const fromCli: Config = {
                headless: false,
                device: "Galaxy S8",
                headers: { "H1": "A", "H2": "B" },
                dryRun: true,
                verbose: true
            } as any;
            const fromManifest: Config = {
                device: "Nexus 10",
                headers: { "H1": "1", "H3": "3" },
                retries: 3,
                proxy: { server: "myproxy.com:3128" }
            } as any;
            assert.deepEqual(await loadConfig(fromCli, fromManifest), {
                browser: "chromium", // Default
                headless: false, // CLI overrides default
                device: "Galaxy S8", // CLI overrides manifest
                headers: { "H1": "A", "H2": "B", "H3": "3" }, // CLI merges with manifest
                retries: 3, // Manifest overrides default
                output: ".", // Default
                formats: ["html", "json"], // Default,
                proxy: { server: "myproxy.com:3128" }, // Manifest only
                dryRun: true, // CLI overrides default
                verbose: true // CLI overrides default
            });
        });

        for (const t of [
            { key: "'device'", config: { device: "unknown" } },
            { key: "'output' (doesn't exist)", config: { output: "./notFound/" } },
            { key: "'output' (not a directory)", config: { output: "./README.md" } },
            { key: "'timeout' (negative)", config: { timeout: -10 } },
            { key: "'timeout' (too high)", config: { timeout: 900000 } },
            { key: "'retries' (negative)", config: { retries: -10 } },
            { key: "'retries' (too high)", config: { retries: 150 } }
        ]) {
            it(_("should throw for invalid %s", t.key), async () => {
                await assert.rejects(() => loadConfig({} as any, t.config as any));
            });
        }
    });

    describe("#parseHttpHeaders()", () => {
        for (const t of [
            { value: "X-User: user", previous: undefined, output: { "X-User": "user" } },
            { value: "X-Roles: adm, usr", previous: { "X-User": "user" }, output: { "X-User": "user", "X-Roles": "adm, usr" } }
        ]) {
            it(_("should parse '%s' and merge with %o", t.value, t.previous), () => {
                assert.deepEqual(parseHttpHeaders(t.value, t.previous), t.output);
            });
        }

        for (const t of [
            { value: "" },
            { value: "X-Invalid=Separator" }
        ]) {
            it(_("should throw for '%s'", t.value), () => {
                assert.throws(() => parseHttpHeaders(t.value));
            });
        }
    });
});
