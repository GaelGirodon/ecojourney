import { JSONPath } from "jsonpath-plus";
import assert from "node:assert/strict";
import { existsSync, mkdirSync } from "node:fs";
import { readFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { format as _ } from "node:util";
import prompts from "prompts";
import { parse } from "yaml";
import { init } from "./init.js";

/** Path to the output directory */
const output = fileURLToPath(new URL("../../test/output", import.meta.url));
mkdirSync(output, { recursive: true });

/** Path to the initialised manifest file */
const path = join(output, "ecojourney.yml");

/** Test cases */
const tests = [
    {
        name: "path provided interactively",
        path: undefined,
        values: [path, "", "", "http://localhost:3000", false, "basic", false],
        expect: {
            lines: 1,
            properties: {
                url: "http://localhost:3000"
            }
        }
    },
    {
        name: "URL only",
        path,
        values: ["", "", "http://localhost:3000", false, "basic", false],
        expect: {
            lines: 1,
            properties: {
                url: "http://localhost:3000"
            }
        }
    },
    {
        name: "name, description and URL",
        path,
        values: ["Name", "Desc", "http://localhost:3000", false, "basic", false],
        expect: {
            lines: 3,
            properties: {
                name: "Name",
                description: "Desc",
                url: "http://localhost:3000"
            }
        }
    },
    {
        name: "proxy from environment variables",
        path,
        values: ["", "", "http://localhost:3000", "env", false, "basic", false],
        expect: {
            lines: 5,
            properties: {
                "config.proxy.server": "{{ env.HTTP_PROXY }}",
                "config.proxy.bypass": "{{ env.NO_PROXY }}"
            }
        }
    },
    {
        name: "custom proxy and authentication",
        path,
        values: ["", "", "http://localhost:3000", "custom", "http://myproxy.com:3128", true, "basic", false],
        expect: {
            lines: 6,
            properties: {
                "config.proxy.server": "http://myproxy.com:3128",
                "config.proxy.username": "{{ env.PROXY_USERNAME }}",
                "config.proxy.password": "{{ env.PROXY_PASSWORD }}"
            }
        }
    },
    {
        name: "$schema reference",
        path,
        values: ["", "", "http://localhost:3000", false, "basic", true],
        expect: {
            lines: 2,
            properties: {}
        }
    },
    {
        name: "simple starter template",
        path,
        values: ["", "", "http://localhost:3000", false, "simple", false],
        expect: {
            lines: 16,
            properties: {
                actions: true
            }
        }
    },
    {
        name: "intermediate starter template",
        path,
        values: ["", "", "http://localhost:3000", false, "intermediate", false],
        expect: {
            lines: 22,
            properties: {
                actions: true
            }
        }
    },
    {
        name: "advanced starter template",
        path,
        values: ["", "", "http://localhost:3000", false, "advanced", false],
        expect: {
            lines: 27,
            properties: {
                "procedures.login": true,
                actions: true
            }
        }
    }
];

describe("init", () => {
    describe("#init()", () => {
        for (const test of tests) {
            it(_("should initialise a manifest file with %s", test.name), async () => {
                prompts.inject(test.values);
                await init(test.path, {});
                const manifestYml = await readFile(path, { encoding: "utf8" });
                assert.equal(manifestYml.match(/^.+$/gm)?.length, test.expect.lines);
                const manifest = parse(manifestYml);
                for (const [path, value] of Object.entries(test.expect.properties)) {
                    if (value === true) {
                        assert.equal(JSONPath({ path, json: manifest }).length, 1);
                    } else {
                        assert.equal(JSONPath({ path, json: manifest })[0], value);
                    }
                }
            });
        }

        afterEach(async () => {
            if (existsSync(path)) {
                await unlink(path);
            }
        });
    });
});
