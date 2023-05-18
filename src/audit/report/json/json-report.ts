import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { programName } from "../../../meta.js";
import log from "../../../util/log.js";
import { pick } from "../../../util/object.js";
import { ReportData } from "../model.js";

/**
 * Write analysis results to a JSON report.
 * @param data Data to write to the report
 * @returns Output JSON report file path
 */
export async function jsonReport(data: ReportData) {
    const output = join(data.config.output, `${programName}-report.json`);
    log.info("Write JSON report to %s", output);
    const content = JSON.stringify({
        ...pick(data.manifest, ["name", "description", "url"]),
        config: pick(data.config, ["browser", "headless", "device", "dryRun"]),
        ...pick(data, ["result", "metrics", "rules"])
    });
    await writeFile(output, content, { encoding: "utf8" });
    return output;
}
