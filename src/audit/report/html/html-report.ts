import { render } from "ejs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { programName } from "../../../meta.js";
import log from "../../../util/log.js";
import { ReportData } from "../model.js";

/**
 * Write analysis results to an HTML report.
 * @param data Data to write to the report
 * @returns Output HTML report file path
 */
export async function htmlReport(data: ReportData) {
    const output = join(data.config.output, `${programName}-report.html`);
    log.info("Write HTML report to %s", output);
    const templatePath = new URL("./template.html", import.meta.url);
    const template = await readFile(templatePath, { encoding: "utf8" });
    await writeFile(output, render(template, data), { encoding: "utf8" });
    return output;
}
