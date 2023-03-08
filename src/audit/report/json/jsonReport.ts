import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import log from "../../../util/log.js";
import { pick } from "../../../util/object.js";
import { ReportData } from "../model.js";

/**
 * Write analysis results to an JSON report.
 * @param data Data to write to the report
 * @returns Output JSON report file path
 */
export async function jsonReport(data: ReportData) {
    const output = join(data.config.output, "report.json");
    log.info("Write JSON report to %s", output);
    const content = JSON.stringify({
        ...pick(data.manifest, ["name", "description", "url"]),
        config: pick(data.config, ["browser", "headless", "device", "dryRun"]),
        result: data.result,
        metrics: Object.fromEntries(data.metrics.entries()),
        rules: Object.fromEntries(data.rules.entries())
    }, undefined, 2);
    await writeFile(output, content, { encoding: "utf8" });
    return output;
}
