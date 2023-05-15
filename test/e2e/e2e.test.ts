import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { Server } from "node:http";
import { join } from "node:path";
import { env } from "node:process";
import { fileURLToPath } from "node:url";
import { Rule, RuleId } from "../../src/audit/analysis/analysers/spec.js";
import { ScenarioResult } from "../../src/audit/analysis/result.js";
import { Audit } from "../../src/audit/audit.js";
import { Config, defaultConfig } from "../../src/audit/config.js";
import { programName } from "../../src/meta.js";
import { start } from "./stub/stub.js";

describe(programName, () => {
    let stub: Server;

    before(async () => stub = await start());

    it("should run an audit", async () => {
        // Setup
        const data = join(fileURLToPath(import.meta.url), "../data");
        const output = join(data, "../output");
        const config: Config = { ...defaultConfig, output, verbose: true };
        env.USER_PASSWORD = env.ADMIN_PASSWORD = "password";
        await mkdir(output, { recursive: true });

        // Run audit
        await new Audit(join(data, `${programName}.yml`), config).run();

        // Assert
        assert.ok(existsSync(join(output, "admin-page.png")));
        assert.ok(existsSync(join(output, "profile-page.png")));
        const htmlReport = await readFile(join(output, `${programName}-report.html`),
            { encoding: "utf8" });
        assert.ok(htmlReport);
        const jsonReport = JSON.parse(await readFile(join(output, `${programName}-report.json`),
            { encoding: "utf8" }));
        assert.ok(jsonReport);
        assert.equal(Object.keys(jsonReport).length, 7);
        assert.equal(jsonReport.result?.scenarios?.length, 2);
        assert.equal(jsonReport.result?.scenarios?.[0]?.pages?.length, 3);
        assert.equal(jsonReport.result?.scenarios?.[1]?.pages?.length, 3);
        assert.equal(jsonReport.result?.measures?.length, 26);
        assert.deepEqual(jsonReport.result?.stats, { info: 46, minor: 32, major: 7, critical: 0 });
        assert.equal(Object.keys(jsonReport.metrics).length, 26);
        assert.equal(Object.keys(jsonReport.rules).length, 25);
        assert.deepEqual(jsonReport.result.scenarios
            .flatMap((s: ScenarioResult) => s.pages.flatMap(p => p.issues))
            .map((i: Rule) => i.id)
            .filter((id: RuleId, i: number, all: RuleId[]) => all.indexOf(id) === i)
            .sort(),
            Object.keys(jsonReport.rules).sort());
    });

    after((done) => stub.close(done));
});
