import log from "../../../util/log.js";
import { ReportData } from "../model.js";
import { InfluxDB, Point } from "./api.js";

/**
 * Write analysis results to an InfluxDB time-series database.
 * @param data Data to write to the database
 */
export async function influxDBReport(data: ReportData) {
    const cfg = data.config.influxdb!;
    log.info("Write analysis results to InfluxDB bucket '%s' at %s", cfg.bucket, cfg.url);
    const points: Point[] = [];

    // Audit
    // > Stats
    points.push(new Point(`${cfg.prefix}issues`)
        .scope("audit").config(data.config)
        .stats(data.result));
    // > Measures
    for (const auditMeasure of data.result.measures.filter(m => m.isPrimary())) {
        points.push(new Point(`${cfg.prefix}measure`)
            .scope("audit")
            .measure(auditMeasure));
    }
    // Scenarios
    for (const scenario of data.result.scenarios) {
        // > Stats
        points.push(new Point(`${cfg.prefix}issues`)
            .scope("scenario").scenario(scenario).config(data.config)
            .stats(scenario));
        // > Measures
        for (const scenarioMeasure of scenario.measures.filter(m => m.isPrimary())) {
            points.push(new Point(`${cfg.prefix}measure`)
                .scope("scenario").scenario(scenario)
                .measure(scenarioMeasure));
        }
        // Pages
        for (const page of scenario.pages) {
            // > Stats
            points.push(new Point(`${cfg.prefix}issues`)
                .scope("page").scenario(scenario).page(page).config(data.config)
                .stats(page));
            // > Measures
            for (const pageMeasure of page.measures.filter(m => m.isPrimary())) {
                points.push(new Point(`${cfg.prefix}measure`)
                    .scope("page").scenario(scenario).page(page)
                    .measure(pageMeasure));
            }
        }
    }

    if (data.config.dryRun) {
        return;
    }

    return await new InfluxDB(cfg)
        .write(points.map(p => p
            .timestamp(data.manifest.time)
            .tag("app_name", data.manifest.name)
            .tag("app_url", data.manifest.url)
        ));
}
