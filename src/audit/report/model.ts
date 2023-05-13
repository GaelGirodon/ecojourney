import { Metric, MetricId, Rule, RuleId } from "../analysis/analysers/spec.js";
import { WebsiteResult } from "../analysis/result.js";
import { Config } from "../config.js";
import { Manifest } from "../manifest/manifest.js";

/**
 * A report input data
 */
export interface ReportData {

    /** Audit manifest */
    readonly manifest: Manifest;

    /** Audit configuration */
    readonly config: Config;

    /** Metrics definitions */
    readonly metrics: { [id: MetricId]: Metric };

    /** Rules definitions */
    readonly rules: { [id: RuleId]: Rule };

    /** Analysis result */
    readonly result: WebsiteResult;

}

/**
 * Report format
 */
export type ReportFormat = "html" | "json";

/**
 * A report generator
 */
export type ReportGenerator = (data: ReportData) => Promise<any>;
