import { PageArtifact } from "../../collection/artifact.js";
import { IssueData } from "../issue.js";
import { MeasureData } from "../measure.js";
import { MetricId, PageAnalyserSpec } from "./spec.js";

/**
 * A page analyser that can either collect metrics and/or
 * analyse compliance over good practices.
 */
export abstract class PageAnalyser {

    /**
     * Analyser metadata defined using the meta.yml file
     */
    metadata!: PageAnalyserSpec;

    /**
     * Analyse the given page and return a set of results.
     * @param page Page to analyse
     * @returns Issues and/or metrics
     */
    abstract analyse(page: PageArtifact): Promise<PageAnalyserResult>;

}

/**
 * Analysis result from a page analyser
 */
export interface PageAnalyserResult {

    /** Measures */
    readonly measures?: { [id: MetricId]: MeasureData };

    /** Issues */
    readonly issues?: IssueData[];

}
