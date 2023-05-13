import { Command } from "commander";
import { Audit } from "./audit/audit.js";
import { Config, parseHttpHeaders } from "./audit/config.js";
import { init } from "./init/init.js";
import { programName } from "./meta.js";
import { Option } from "./util/cli.js";
import log from "./util/log.js";

/**
 * Application entrypoint
 */
export default async function main() {
    try {
        await (cli()).parseAsync();
    } catch (error: any) {
        log.error("%s", log.formatError(error));
        log.debug("%o", error);
        process.exitCode = 1;
    }
}

/**
 * Build the program command line interface.
 * @returns Command line interface
 */
export function cli(): Command {
    const program = new Command();
    const envPrefix = programName.toUpperCase();

    program
        .name(programName)
        .description("Eco-design website audit tool")
        .version("0.1.0")
        .addOption(new Option("-v, --verbose", "enable verbose output")
            .env(`${envPrefix}_VERBOSE`))
        .on("option:verbose", function () {
            process.env.VERBOSE = this.opts().verbose;
        })
        .configureHelp({ showGlobalOptions: true });

    program.command("audit")
        .summary("audit a website eco-design compliance")
        .description("Audit a website eco-design compliance")
        .argument("<path>", "path to the audit manifest file or website page URL")
        .addOption(new Option("-b, --browser [browser]",
            "browser to run the audit with")
            .choices(["msedge", "chrome", "chromium", "firefox", "webkit"])
            .env(`${envPrefix}_AUDIT_BROWSER`))
        .addOption(new Option("-l, --headless [headless]",
            "run browser in headless mode")
            .choices(["true", "false"])
            .preset("true")
            .argParser((value) => /^(true|1)$/.test(`${value}`))
            .env(`${envPrefix}_AUDIT_HEADLESS`))
        .addOption(new Option("-d, --device [device]",
            "simulate browser behavior for a specific device (e.g. Galaxy S8)")
            .env(`${envPrefix}_AUDIT_DEVICE`))
        .addOption(new Option("-H, --header [headers...]",
            "additional HTTP headers to be sent with every request")
            .argParser(parseHttpHeaders)
            .env(`${envPrefix}_AUDIT_HEADERS`)
            .attributeName("headers"))
        .addOption(new Option("-t, --timeout [timeout]",
            "maximum time to wait for navigations or actions, in milliseconds")
            .argParser(parseInt)
            .env(`${envPrefix}_AUDIT_TIMEOUT`))
        .addOption(new Option("-r, --retry [retry]",
            "number of retries in case of failure")
            .argParser(parseInt)
            .env(`${envPrefix}_AUDIT_RETRY`)
            .attributeName("retries"))
        .addOption(new Option("-o, --output [output]",
            "directory to write reports to")
            .env(`${envPrefix}_AUDIT_OUTPUT`))
        .addOption(new Option("-f, --format [formats...]",
            "output report formats")
            .choices(["html", "json"])
            .env(`${envPrefix}_AUDIT_FORMAT`)
            .attributeName("formats"))
        .addOption(new Option("-s, --dry-run",
            "simulate the audit without actually running the browser")
            .env(`${envPrefix}_AUDIT_DRY_RUN`))
        .action(async (path: string, opts: Config) => {
            log.debug("audit %s with opts: %o", path, opts);
            await (new Audit(path, opts)).run();
        });

    program.command("init")
        .summary("initialise a manifest file interactively")
        .description("Initialise a manifest file interactively")
        .argument("[path]", "path to the audit manifest file to generate")
        .action(async (path: string, opts: Config) => {
            await init(path, opts);
        });

    return program;
}
