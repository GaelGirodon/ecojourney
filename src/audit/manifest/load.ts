import { validate } from "jsonschema";
import { readFile } from "node:fs/promises";
import { parse } from "yaml";
import log from "../../util/log.js";
import { isHttpUrl } from "../../util/validation.js";
import { Manifest } from "./manifest.js";

/**
 * Open, parse and validate a manifest file.
 * @param path Path to the manifest file
 * @return The loaded manifest
 */
export async function loadManifest(path: string): Promise<Manifest> {
    const manifest = isHttpUrl(path)
        ? { url: path } as Manifest // From a website page URL
        : await getManifest(path);  // Load, parse and validate a manifest file
    manifest.time = new Date();
    if (!manifest.name) {
        manifest.name = manifest.url.replace(/^\w+:\/\/|\/+$/g, "");
    }
    return manifest;
}

async function getManifest(path: string): Promise<Manifest> {
    try {
        log.info("Load manifest from %s", path);
        const file = await readFile(path, { encoding: "utf8" });
        const manifest = parse(file);
        const schema = JSON.parse(await readFile(
            new URL("./manifest.schema.json", import.meta.url),
            { encoding: "utf8" }));
        validate(manifest, schema, { throwError: true });
        return manifest as Manifest;
    } catch (error) {
        throw new Error("Manifest file not found or invalid", { cause: error });
    }
}
