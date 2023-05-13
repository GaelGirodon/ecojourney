import { readdir, readFile } from "node:fs/promises";
import { parse } from "yaml";
import log from "../../util/log.js";
import { PageArtifact } from "../collection/artifact.js";
import { PageAnalyser } from "./analysers/analyser.js";
import { Metric, MetricId, PageAnalyserSpec, Rule, RuleId } from "./analysers/spec.js";
import { Issue } from "./issue.js";
import { Measure } from "./measure.js";
import { Reference } from "./reference.js";
import { PageResult, Scenario } from "./result.js";

/**
 * The core analyser
 */
export class Analyser {

    private constructor(
        /** Page analysers */
        readonly analysers: PageAnalyser[],
        /** Metrics definitions */
        readonly metrics: { [id: MetricId]: Metric },
        /** Rules definitions */
        readonly rules: { [id: RuleId]: Rule }
    ) { }

    /**
     * Analyse pending items using the available analysers.
     * @param page Page to analyse
     * @param scenario Browsing scenario
     * @returns Page analysis result (or undefined if this page must be ignored)
     */
    async analyse(page: PageArtifact, scenario: Scenario) {
        const result = new PageResult(scenario, page.index, page.name,
            page.frame.url(), await page.frame.title());
        log.info("Analyse page '%s' (%s)", result.title, result.url);
        for (const pa of this.analysers) {
            log.debug("Run page analyser %s (%s)", pa.metadata.name, pa.metadata.id);
            const paResult = await pa.analyse(page);
            for (const [id, measure] of Object.entries(paResult.measures || {})) {
                result.measures.push(new Measure(this.metrics[id]!, measure));
            }
            for (const issue of paResult.issues?.filter(i => i.occurrences !== 0) || []) {
                result.issues.push(new Issue(this.rules[issue.id]!, issue));
            }
        }
        result.measures.sort(Measure.compare);
        result.issues.sort(Issue.compare);
        log.info("Page analysed: %d measures, %d issues",
            result.measures.length, result.issues.length);
        return result;
    }

    /**
     * Initialise the analyser with built-in page analysers.
     * @returns The analyser
     */
    static async init() {
        log.debug("Load page analysers");
        const analysers: PageAnalyser[] = [];
        const metrics: { [id: MetricId]: Metric } = {};
        const rules: { [id: RuleId]: Rule } = {};
        const analysersDir = new URL("./analysers", import.meta.url);
        const dirs = (await readdir(analysersDir, { withFileTypes: true }))
            .filter(f => f.isDirectory() && /^[\w\-]+$/.test(f.name))
            .map(d => d.name);
        for (const dir of dirs) {
            const analyserClass = (await import(`./analysers/${dir}/index.js`)).default;
            const analyser = new analyserClass() as PageAnalyser;
            const metaPath = new URL(`./analysers/${dir}/meta.yml`, import.meta.url);
            analyser.metadata = parse(await readFile(metaPath,
                { encoding: "utf8" })) as PageAnalyserSpec;
            if (analyser.metadata.metrics) {
                for (const [id, meta] of Object.entries(analyser.metadata.metrics)) {
                    metrics[id] = meta;
                }
            }
            if (analyser.metadata.rules) {
                for (const [id, meta] of Object.entries(analyser.metadata.rules)) {
                    meta.references = meta.references?.map(r => Reference.expand(r)) ?? [];
                    rules[id] = meta;
                }
            }
            analysers.push(analyser);
        }
        log.debug("Page analysers loaded: %d analysers, %d metrics, %d rules",
            analysers.length, Object.keys(metrics).length, Object.keys(rules).length);
        return new Analyser(analysers, metrics, rules);
    }

}
