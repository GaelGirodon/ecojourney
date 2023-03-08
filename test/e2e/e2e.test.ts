import { mkdir } from "node:fs/promises";
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
        const data = join(fileURLToPath(import.meta.url), "../data");
        const output = join(data, "../output");
        const config: Config = { ...defaultConfig, output, verbose: true,
            headers: [["X-Test", "E2E"]] as any };
        env.USER_PASSWORD = env.ADMIN_PASSWORD = "password";
        await mkdir(output, { recursive: true });
        await new Audit(join(data, "ecojourney.yml"), config).run();
    });

    after((done) => stub.close(done));
});
