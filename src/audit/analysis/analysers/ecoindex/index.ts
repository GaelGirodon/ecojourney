import * as units from "../../../../util/units.js";
import { PageArtifact } from "../../../collection/artifact.js";
import { IssueSeverity } from "../../issue.js";
import { PageAnalyser } from "../analyser.js";
import { getEcoIndex } from "./ecoindex.js";

/** Settings for issues to create directly from measures */
const issuesFromMeasures = [
    {
        measure: "requestsCount",
        rule: "reduce-requests-count",
        thresholds: [10, 50, 100],
        details: (m: number) => `${m} requests`
    },
    {
        measure: "responsesSize",
        rule: "reduce-responses-size",
        thresholds: [50, 500, 5000].map(s => s * 1024),
        details: (m: number) => units.bytes(m)
    },
    {
        measure: "domCount",
        rule: "reduce-dom-size",
        thresholds: [50, 500, 2500],
        details: (m: number) => `${m} elements`
    }
];

export default class EcoIndexPageAnalyser extends PageAnalyser {

    async analyse(page: PageArtifact) {
        // Gather measures
        const redirections = page.responses
            .filter(r => [301, 302, 303, 307, 308].includes(r.response.status()));
        const responses = page.responses.filter(r => !r.servedFromCache);
        const measures: { [key: string]: number } = {
            requestsCount: responses.length,
            responsesSize: responses
                .map(r => r.bodyLength)
                .reduce((sum, size) => sum + size, 0),
            domCount: await page.frame.locator("*").count(),
            redirectionsCount: redirections.length
        };
        // Compute EcoIndex
        const ecoIndex = getEcoIndex(measures.domCount, measures.requestsCount,
            Math.round(measures.responsesSize / 1024));

        return {
            measures: {
                "requests-count": { value: measures.requestsCount },
                "responses-size": { value: measures.responsesSize },
                "dom-elements-count": { value: measures.domCount },
                "eco-index": { value: ecoIndex.score },
                "greenhouse-gases-emission": { value: ecoIndex.ges },
                "water-consumption": { value: ecoIndex.water },
                "redirections-count": { value: measures.redirectionsCount }
            },
            issues: [
                ...issuesFromMeasures
                    .filter(i => measures[i.measure] >= i.thresholds[0])
                    .map(i => ({
                        id: i.rule,
                        severity: IssueSeverity.fromThresholds(measures[i.measure], ...i.thresholds),
                        details: i.details(measures[i.measure])
                    })),
                ...redirections
                    .map(r => ({
                        id: "avoid-redirections",
                        severity: IssueSeverity.Minor,
                        details: `${r.response.status()} → <a href="${r.response.url()}">${r.response.url()}</a>`
                    }))
            ]
        };
    }

}
