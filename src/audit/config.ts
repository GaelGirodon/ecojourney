import { stat } from "node:fs/promises";
import { devices, LaunchOptions } from "playwright-core";
import { ReportFormat } from "./report/model.js";
import { InvalidArgumentError } from "commander";
import { renderObject } from "./browsing/template.js";

/**
 * Audit configuration
 */
export interface Config {

    /** Browser to run the audit with */
    browser: "msedge" | "chrome" | "chromium" | "firefox" | "webkit";

    /** Run browser in headless mode */
    headless: boolean;

    /** Simulate browser behavior for a specific device */
    device?: string;

    /** Additional HTTP headers to be sent with every request */
    headers?: { [key: string]: string; };

    /** Maximum time to wait for navigations or actions, in milliseconds */
    timeout?: number;

    /** Number of retries in case of failure */
    retries: number;

    /** Directory to write reports to */
    output: string;

    /** Output report formats */
    formats: ReportFormat[];

    /** Network proxy settings */
    proxy?: LaunchOptions["proxy"];

    /** Simulate the audit without actually running the browser */
    dryRun: boolean;

    /** Enable verbose output */
    verbose: boolean;

}

/**
 * Default audit configuration
 */
export const defaultConfig: Config = {
    browser: "chromium",
    headless: true,
    retries: 0,
    output: ".",
    formats: ["json"],
    dryRun: false,
    verbose: false
};

/**
 * Build the configuration from CLI, manifest and default values,
 * and validate it.
 * @param fromCli Configuration from the CLI and environment variables
 * @param fromManifest Configuration from the manifest file
 * @returns The configuration
 */
export async function loadConfig(fromCli: Config, fromManifest: Config) {
    // Convert headers provided through the CLI as a string[][] to a map
    fromCli.headers = (fromCli.headers as unknown as string[][])
        ?.reduce((map: { [key: string]: string; }, [name, value]: string[]) => {
            map[name.trim()] = value.trim();
            return map;
        }, {});
    // Merge configuration
    let config = Object.assign({}, defaultConfig, fromManifest, fromCli);
    // Render templates
    config = renderObject(config, { env: process.env }) as Config;
    // Device
    if (config.device && !(config.device in devices)) {
        throw new Error(`Unknown device '${config.device}'`);
    }
    // Output
    if (!(await stat(config.output).catch((cause) => {
        throw new Error(`Output report directory '${config.output}' doesn't exist`,
            { cause });
    })).isDirectory()) {
        throw new Error(`Output report path '${config.output}' must be a directory`);
    }
    // Timeout
    if (config.timeout && (config.timeout < 0 || config.timeout > 600000)) {
        throw new Error(`Invalid timeout '${config.timeout}'`);
    }
    // Retries
    if (config.retries < 0 || config.retries > 100) {
        throw new Error(`Invalid number of retries '${config.retries}'`);
    }
    // Verbose
    if (config.verbose) {
        process.env.VERBOSE = "1";
    }
    return config;
}

/**
 * Parse an HTTP header provided as a "name: value" string.
 * @param kv The raw HTTP header
 * @returns Header name and value
 */
export function parseHttpHeader(kv: string) {
    const match = kv.match(/^([\w-]+): ?(.+)$/);
    if (!match) {
        throw new InvalidArgumentError("Invalid HTTP header.");
    }
    return [match[1], match[2]];
}
