import { MetricId, Metric, RuleId, Rule } from "../analysis/analysers/spec.js";
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
    readonly metrics: Map<MetricId, Metric>;

    /** Rules definitions */
    readonly rules: Map<RuleId, Rule>;

    /** Analysis result */
    readonly result: WebsiteResult;

}

/**
 * Report format
 */
export type ReportFormat = "json";

/**
 * A report generator
 */
export type ReportGenerator = (data: ReportData) => Promise<string>;
