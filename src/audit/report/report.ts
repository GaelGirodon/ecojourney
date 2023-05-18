import log from "../../util/log.js";
import { htmlReport } from "./html/html-report.js";
import { influxDBReport } from "./influxdb/influxdb-report.js";
import { jsonReport } from "./json/json-report.js";
import { ReportData, ReportGenerator } from "./model.js";

/**
 * Report generators by format
 */
const reportGenerators: { [key: string]: ReportGenerator } = {
    "html": htmlReport,
    "json": jsonReport,
    "influxdb": influxDBReport
};

/**
 * Export analysis to reports.
 * @param data Data to write to reports
 */
export async function report(data: ReportData) {
    log.info("Write reports (formats: %s)", data.config.formats.join(", "));
    for (const format of data.config.formats) {
        try {
            await reportGenerators[format](data);
        } catch (error) {
            log.error("Failed to write '%s' report: %s", format,
                log.formatError(error));
        }
    }
}
