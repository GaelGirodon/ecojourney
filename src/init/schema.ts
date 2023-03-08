import { readFile } from "fs/promises";

/**
 * Build the manifest schema URL.
 * @returns Manifest schema URL
 */
export async function schema() {
    const packageJson = JSON.parse(await readFile(
        new URL("../../package.json", import.meta.url),
        { encoding: "utf8" }));
    return "https://raw.githubusercontent.com/"
        + (packageJson.homepage as string)
            .split(/[\/#]/g).slice(3, 5).join("/")
        + "/main/src/audit/manifest/manifest.schema.json";
}
