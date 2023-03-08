/**
 * Page analyser metadata defined using the meta.yml file
 */
export interface PageAnalyserSpec {
    /** Analyser unique identifier */
    readonly id: string;
    /** Analyser display name */
    readonly name: string;
    /** Analyser description */
    readonly description?: string;
    /** Metrics produced by this analyser */
    readonly metrics: { [id: string]: Metric };
    /** Rules analysed by this analyser */
    readonly rules: { [id: string]: Rule };
}

/** A metric unique identifier (dash-case) */
export type MetricId = string;

/** A metric unit */
export type MetricUnit = "" | "second" | "byte" | "integer";

/** A metric aggregation function */
export type MetricAggregator = "sum" | "avg";

/**
 * A metric definition
 */
export interface Metric {
    /** Metric unique identifier */
    readonly id: MetricId;
    /** Metric display name */
    readonly name: string;
    /** Metric description */
    readonly description: string;
    /** Metric priority order (0-100, 0 is first) */
    readonly order: number;
    /** Metric unit */
    readonly unit: MetricUnit;
    /** Metric aggregation function */
    readonly aggregation: MetricAggregator;
    /** Metric grade thresholds */
    readonly grade?: number[];
}

/** A rule unique identifier (dash-case) */
export type RuleId = string;

/**
 * A rule definition
 */
export interface Rule {
    /** Rule unique identifier) */
    readonly id: RuleId;
    /** Rule display name */
    readonly name: string;
    /** Rule description */
    readonly description: string;
    /** Rule tags */
    readonly tags: string[];
    /** Rule references */
    readonly references: string[];
}
