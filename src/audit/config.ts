import { InvalidArgumentError } from "commander";
import { stat } from "node:fs/promises";
import { devices, LaunchOptions } from "playwright-core";
import { programName } from "../meta.js";
import { merge } from "../util/object.js";
import { renderObject } from "./browsing/template.js";
import { InfluxDBConfig } from "./report/influxdb/config.js";
import { ReportFormat } from "./report/model.js";

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
    headers?: HttpHeaders;

    /** Network proxy settings */
    proxy?: LaunchOptions["proxy"];

    /** Maximum time to wait for navigations or actions, in milliseconds */
    timeout?: number;

    /** Number of retries in case of failure */
    retries: number;

    /** Directory to write reports to */
    output: string;

    /** Output report formats */
    formats: ReportFormat[];

    /** InfluxDB connection configuration */
    influxdb?: InfluxDBConfig;

    /** Simulate the audit without actually running the browser */
    dryRun: boolean;

    /** Enable verbose output */
    verbose: boolean;

}

/**
 * Default audit configuration allows some missing fields.
 */
type DefaultConfig = Config | {
    influxdb?: Partial<InfluxDBConfig>
};

/**
 * Default audit configuration
 */
export const defaultConfig: DefaultConfig = {
    browser: "chromium",
    headless: true,
    retries: 0,
    output: ".",
    formats: ["html", "json"],
    influxdb: {
        prefix: `${programName}_`
    },
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
    // Merge configuration
    let config = merge(defaultConfig, fromManifest, fromCli);
    // Render templates
    config = renderObject(config, { env: process.env }) as Config;
    // Device
    if (config.device && !(config.device in devices)) {
        throw new Error(`Unknown device '${config.device}'`);
    }
    // Timeout
    if (config.timeout && (config.timeout < 0 || config.timeout > 600000)) {
        throw new Error(`Invalid timeout '${config.timeout}'`);
    }
    // Retries
    if (config.retries < 0 || config.retries > 100) {
        throw new Error(`Invalid number of retries '${config.retries}'`);
    }
    // Output
    if (!(await stat(config.output).catch((cause) => {
        throw new Error(`Output report directory '${config.output}' doesn't exist`,
            { cause });
    })).isDirectory()) {
        throw new Error(`Output report path '${config.output}' must be a directory`);
    }
    // InfluxDB
    if (config.formats.includes("influxdb") && !config.influxdb?.url) {
        throw new Error(`InfluxDB connection configuration is required for report format 'influxdb'`);
    }
    // Verbose
    if (config.verbose) {
        process.env.VERBOSE = "1";
    }
    return config;
}

/**
 * HTTP headers
 */
export type HttpHeaders = { [key: string]: string; };

/**
 * Validate and parse HTTP headers provided as "name: value" strings.
 * @param value The current HTTP header
 * @param previous Already validated and parsed HTTP headers
 * @returns Previous and current HTTP headers (if valid)
 * @throws The current HTTP header is invalid.
 */
export function parseHttpHeaders(value: string, previous?: HttpHeaders): HttpHeaders {
    const match = value.match(/^([\w-]+): ?(.+)$/);
    if (!match) {
        throw new InvalidArgumentError("Invalid HTTP header.");
    }
    return Object.assign({}, previous, { [match[1]]: match[2].trim() });
}
