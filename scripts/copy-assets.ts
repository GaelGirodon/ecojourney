/*
 * copy-assets.ts
 *
 * Copy non-Typescript files from src/ to dist/ directory.
 */

import { cpSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

function copyAssets(src: string, dist: string) {
    const files = readdirSync(src, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            copyAssets(join(src, file.name), join(dist, file.name));
        } else if (!file.name.endsWith(".ts")) {
            cpSync(join(src, file.name), join(dist, file.name));
        }
    }
}

const root = join(fileURLToPath(import.meta.url), "../..");

copyAssets(join(root, "src"), join(root, "dist"));
