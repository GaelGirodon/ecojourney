import process from "node:process";
import { format } from "node:util";

/**
 * Print a debug message to stdout.
 * @param message Log message
 * @param optionalParams Log message parameters
 */
function debug(message: string, ...optionalParams: any[]) {
    if (process.env.VERBOSE) {
        console.log(`[debug] ${message}`, ...optionalParams);
    }
}

/**
 * Print a info message to stdout.
 * @param message Log message
 * @param optionalParams Log message parameters
 */
function info(message: string, ...optionalParams: any[]) {
    console.log(`[info] ${message}`, ...optionalParams);
}

/**
 * Print a warn message to stderr.
 * @param message Log message
 * @param optionalParams Log message parameters
 */
function warn(message: string, ...optionalParams: any[]) {
    console.error(`[warn] ${message}`, ...optionalParams);
}

/**
 * Print an error message to stderr.
 * @param message Log message
 * @param optionalParams Log message parameters
 */
function error(message: string, ...optionalParams: any[]) {
    console.error(`[error] ${message}`, ...optionalParams);
}

/**
 * Format an error and its cause.
 * @param err Error to format
 * @returns Error formatted as a string
 */
function formatError(err: any) {
    return format(`%s${err.cause ? " (%s)" : ""}`,
        err?.message ?? err, err?.cause?.message ?? err?.cause)
}

export default { debug, info, warn, error, formatError };
