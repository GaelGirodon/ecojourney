import { omit } from "../../util/object.js";
import { slugify } from "../../util/string.js";
import { Config } from "../config.js";
import { Manifest } from "../manifest/manifest.js";
import { Metric, MetricId, Rule, RuleId } from "./analysers/spec.js";
import { Issue, IssueSeverity } from "./issue.js";
import { Measure, aggregateMeasures } from "./measure.js";

/**
 * A full analysis result to write to reports
 */
export interface AnalysisResult {

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
 * An aggregated analysis result
 */
export interface AggregatedResult {

    /** Aggregated measures */
    readonly measures: Measure[];

    /** Number of issues per severity */
    readonly stats: IssuesStatistics;

}

/**
 * A website analysis result
 */
export interface WebsiteResult extends AggregatedResult {

    /** Scenario results */
    readonly scenarios: ScenarioResult[];

}

/**
 * A browsing scenario analysis result
 */
export interface ScenarioResult extends Scenario, AggregatedResult {

    /** Page analysis results */
    readonly pages: PageAggregatedResult[];

}

/**
 * A browsing scenario.
 */
export class Scenario {

    /** Time at which the scenario was created */
    readonly time: Date;

    constructor(
        /** The scenario index */
        readonly index: number = -1,
        /** The scenario name */
        readonly name: string = "",
        /** Exclude this scenario from analysis */
        readonly exclude: boolean = false
    ) {
        this.time = new Date();
    }

    /**
     * The scenario unique identifier
     */
    public get id(): string {
        return slugify(`s${this.index}-${this.name}`);
    }

    /**
     * @returns The object to serialize as JSON
     */
    public toJSON() {
        return omit(this, ["exclude"]);
    }

}

/**
 * A page analysis result with statistics
 */
export type PageAggregatedResult = PageResult & AggregatedResult;

/**
 * A page analysis result
 */
export class PageResult {

    /** Time at which the page result was created */
    readonly time: Date;

    constructor(
        /** The browsing scenario */
        readonly scenario: Scenario = new Scenario(),
        /** The page index */
        readonly index: number = -1,
        /** The page name */
        readonly name: string = "",
        /** The page URL */
        readonly url: string = "",
        /** The page title */
        readonly title: string = "",
        /** Page measures */
        readonly measures: Measure[] = [],
        /** Page issues */
        readonly issues: Issue[] = []
    ) {
        this.time = new Date();
    }

    /**
     * The page unique identifier
     */
    public get id(): string {
        return slugify(`p${this.index}-${this.name}`);
    }

    /**
     * @returns The object to serialize as JSON
     */
    public toJSON() {
        return omit(this, ["scenario"]);
    }

}

/**
 * Aggregate page results.
 * @param pages Page results
 * @returns Global website analysis result
 */
export function aggregateResults(pages: PageResult[]): WebsiteResult {
    const scenarios: ScenarioResult[] = [];         // All scenarios to collect
    const websiteMeasures: Measure[] = [];          // All measures to collect then aggregate
    const websiteStats = new IssuesStatistics();    // Global statistics to aggregate

    let scenarioId: string = "";                    // Current scenario id
    let scenarioPages: PageAggregatedResult[] = []; // Scenario pages to collect
    let scenarioMeasures: Measure[] = [];           // Scenario measures to collect then aggregate
    let scenarioStats = new IssuesStatistics();     // Scenario statistics to aggregate

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        if (!scenarioId) {
            scenarioId = page.scenario.id;
        }
        // Compute page statistics
        const pageStats = new IssuesStatistics().addFromIssues(page.issues);
        // Collect page, measures and statistics for the current scenario result
        scenarioPages.push(Object.assign(new PageResult(), {
            ...page, stats: pageStats
        }));
        scenarioMeasures.push(...page.measures);
        scenarioStats.add(pageStats);
        // Aggregate scenario data
        if (i + 1 >= pages.length || scenarioId !== pages[i + 1].scenario.id) {
            // Collect scenario, measures and statistics in global result
            scenarios.push(Object.assign(new Scenario(), {
                ...scenarioPages[0].scenario,
                pages: scenarioPages,
                measures: aggregateMeasures(scenarioMeasures),
                stats: scenarioStats
            }));
            websiteMeasures.push(...scenarioMeasures);
            websiteStats.add(scenarioStats);
            // Prepare to aggregate results for the next scenario
            scenarioId = i + 1 >= pages.length ? "" : pages[i + 1].scenario.id;
            scenarioPages = [];
            scenarioMeasures = [];
            scenarioStats = new IssuesStatistics();
        }
    }

    return {
        scenarios,
        measures: aggregateMeasures(websiteMeasures),
        stats: websiteStats
    };
}

/**
 * Number of issues per severity level
 */
export class IssuesStatistics {

    constructor(
        public info: number = 0,
        public minor: number = 0,
        public major: number = 0,
        public critical: number = 0
    ) { }

    /**
     * Add other statistics to current ones.
     * @param that Other statistics to add
     * @returns this
     */
    add(that: IssuesStatistics) {
        this.info += that.info;
        this.minor += that.minor;
        this.major += that.major;
        this.critical += that.critical;
        return this;
    }

    /**
     * Add statistics from issues.
     * @param issues Issues to compute statistics from
     * @returns this
     */
    addFromIssues(issues: Issue[]) {
        for (const issue of issues) {
            this[issue.data.severity.label] += 1;
        }
        return this;
    }

    toArray() {
        return [
            IssueSeverity.Info,
            IssueSeverity.Minor,
            IssueSeverity.Major,
            IssueSeverity.Critical
        ].map(s => ({ severity: s, count: this[s.label] }));
    }

}
