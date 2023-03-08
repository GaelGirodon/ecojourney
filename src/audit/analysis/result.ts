import { omit } from "../../util/object.js";
import { Scenario } from "../collection/artifact.js";
import { Config } from "../config.js";
import { Manifest } from "../manifest/manifest.js";
import { MetricId, Metric, RuleId, Rule } from "./analysers/spec.js";
import { Issue, IssueSeverity } from "./issue.js";
import { aggregateMeasures, Measure } from "./measure.js";

/**
 * A full analysis result to write to reports
 */
export interface AnalysisResult {

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
 * A page analysis result with statistics
 */
export type PageAggregatedResult = PageResult & AggregatedResult;

/**
 * A page analysis result
 */
export class PageResult {

    constructor(
        /** The browsing scenario */
        readonly scenario: Scenario,
        /** The page name */
        readonly name: string,
        /** The page URL */
        readonly url: string,
        /** The page title */
        readonly title: string,
        /** Page measures */
        readonly measures: Measure[] = [],
        /** Page issues */
        readonly issues: Issue[] = []
    ) { }

    /**
     * @returns The object to serialize as JSON
     */
    public toJSON() {
        return omit(this, ["scenario"]);
    }

    /**
     * Clone th given page result into a new one.
     * @param p The page result to clone
     * @returns The clone
     */
    static clone(p: PageResult): PageResult {
        return new PageResult(p.scenario, p.name, p.url,
            p.title, p.measures, p.issues);
    }

}

/**
 * Aggregate page results.
 * @param pages Page results
 * @returns Global website analysis result
 */
export function aggregateResults(pages: PageResult[]): WebsiteResult {
    let scenarios: ScenarioResult[] = [];           // All scenarios to collect
    let websiteMeasures: Measure[] = [];            // All measures to collect then aggregate
    let websiteStats = new IssuesStatistics();      // Global statistics to aggregate

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
        scenarioPages.push(Object.assign(PageResult.clone(page), {
            stats: pageStats
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
            this[issue.data.severity] += 1;
        }
        return this;
    }

    toArray() {
        return [
            IssueSeverity.Info,
            IssueSeverity.Minor,
            IssueSeverity.Major,
            IssueSeverity.Critical
        ].map(s => ({ severity: s, count: this[s] }));
    }

}
