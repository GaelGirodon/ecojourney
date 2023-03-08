/*
 * generate-readme.ts
 *
 * Generate automatically some README.md sections
 * from the program source code.
 */

import { render } from "ejs";
import { readFileSync, writeFileSync } from "node:fs";
import { Analyser } from "../src/audit/analysis/analyser.js";
import { defaultConfig } from "../src/audit/config.js";
import { cli } from "../src/cli.js";
import { capitalise, uncapitalise, trimEndDot } from "../src/util/string.js";

// Setup templates and output
const keys = ["cli", "manifest", "analysers"];
const sections = keys.reduce((obj: { [key: string]: string }, k) => { obj[k] = "\n"; return obj; }, {});
const templates = keys.reduce((obj: { [key: string]: string }, k) => {
    const path = new URL(`./templates/${k}.md.ejs`, import.meta.url);
    obj[k] = readFileSync(path, { encoding: "utf8" })
    return obj;
}, {});

// Read README.md
const readmePath = new URL("../README.md", import.meta.url);
let readme = readFileSync(readmePath, { encoding: "utf8" });

// Render CLI section
sections.cli = render(templates.cli, { program: cli(), defaultConfig, cap: capitalise });

// Render Manifest section
const manifestPath = new URL("../src/audit/manifest/manifest.schema.json", import.meta.url);
const manifest = JSON.parse(readFileSync(manifestPath, { encoding: "utf8" }));
sections.manifest = render(templates.manifest, { manifest, defaultConfig, uncap: uncapitalise, trimEndDot });

// Render Analysers section
const analysers = (await Analyser.init()).analysers
    .map(a => a.metadata).filter(a => a.metrics || a.rules);
sections.analysers = render(templates.analysers, { analysers });

// Replace sections in README.md
for (const key of Object.keys(sections)) {
    readme = readme.replace(
        new RegExp(`(<!-- ${key}.start -->).*(<!-- ${key}.end -->)`, "s"),
        `$1\n${sections[key].trim()}\n$2`
    );
}
writeFileSync(readmePath, readme, { encoding: "utf8" });
