import log from "../../util/log.js";
import { htmlReport } from "./html/html-report.js";
import { jsonReport } from "./json/json-report.js";
import { ReportData, ReportGenerator } from "./model.js";

/**
 * Report generators by format
 */
const reportGenerators: { [key: string]: ReportGenerator } = {
    "html": htmlReport,
    "json": jsonReport
};

/**
 * Export analysis to reports.
 * @param data Data to write to reports
 */
export async function report(data: ReportData) {
    log.info("Write reports (formats: %s)", data.config.formats.join(", "));
    for (const format of data.config.formats) {
        await reportGenerators[format](data);
    }
}
