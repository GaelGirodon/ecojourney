import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { Server } from "node:http";
import { join } from "node:path";
import { env } from "node:process";
import { fileURLToPath } from "node:url";
import { Audit } from "../../src/audit/audit.js";
import { Config, defaultConfig } from "../../src/audit/config.js";
import { start } from "./stub/stub.js";

describe("ecojourney", () => {
    let stub: Server;

    before(async () => stub = await start());

    it("should run an audit", async () => {
        // Setup
        const data = join(fileURLToPath(import.meta.url), "../data");
        const output = join(data, "../output");
        const config: Config = {
            ...defaultConfig, output, verbose: true,
            headers: [["X-Test", "E2E"]] as any
        };
        env.USER_PASSWORD = env.ADMIN_PASSWORD = "password";
        await mkdir(output, { recursive: true });

        // Run audit
        await new Audit(join(data, "ecojourney.yml"), config).run();

        // Assert
        assert.ok(existsSync(join(output, "admin-page.png")));
        assert.ok(existsSync(join(output, "profile-page.png")));
        const report = JSON.parse(await readFile(join(output, "report.json"),
            { encoding: "utf8" }));
        assert.ok(report);
        assert.equal(Object.keys(report).length, 7);
        assert.equal(report.result?.scenarios?.length, 2);
        assert.equal(report.result?.scenarios?.[0]?.pages?.length, 3);
        assert.equal(report.result?.scenarios?.[1]?.pages?.length, 3);
        assert.equal(report.result?.measures?.length, 10);
        assert.deepEqual(report.result?.stats, { info: 12, minor: 0, major: 0, critical: 0 });
        assert.equal(Object.keys(report.metrics).length, 10);
        assert.equal(Object.keys(report.rules).length, 3);
    });

    after((done) => stub.close(done));
});
