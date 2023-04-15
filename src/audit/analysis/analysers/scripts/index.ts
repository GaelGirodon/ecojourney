import * as units from "../../../../util/units.js";
import { PageArtifact, ResponseArtifact } from "../../../collection/artifact.js";
import { IssueSeverity } from "../../issue.js";
import { PageAnalyser } from "../analyser.js";
import { isMinified } from "../util.js";

/** Severity thresholds per measure */
const thresholds = {
    count: [3, 6, 12],
    size: [5, 50, 500].map(s => s * 1024)
};

export default class ScriptsPageAnalyser extends PageAnalyser {

    async analyse(page: PageArtifact) {
        // Gather measures
        const extScripts = page.responses.filter(r => isScript(r));
        const extScriptsSize = extScripts.map(r => r.bodyLength)
            .reduce((sum, size) => sum + size, 0);
        const embScripts = await page.frame.locator("script:not([src])").allInnerTexts();
        const embScriptsSize = embScripts.map(r => r.length)
            .reduce((sum, size) => sum + size, 0);
        const scriptsCount = extScripts.length + embScripts.length;

        return {
            measures: {
                "external-scripts-count": { value: extScripts.length },
                "external-scripts-size": { value: extScriptsSize },
                "embedded-scripts-count": { value: embScripts.length },
                "embedded-scripts-size": { value: embScriptsSize }
            },
            issues: [
                ...embScripts
                    .map((s, i) => ({
                        id: "externalise-script",
                        severity: IssueSeverity.fromThresholds(s.length, ...thresholds.size),
                        details: `<code>script:not([src]):nth-of-type(${i})</code> (${units.bytes(s.length)})`
                    })),
                ...extScripts
                    .filter(s => !isMinified(s.body?.toString("utf8")))
                    .map(s => ({
                        id: "minify-script",
                        severity: IssueSeverity.fromThresholds(s.bodyLength, ...thresholds.size),
                        details: `<a href="${s.response.url()}">${s.response.url()}</a> (${units.bytes(s.bodyLength)})`
                    })),
                ...embScripts
                    .filter(s => !isMinified(s))
                    .map((s, i) => ({
                        id: "minify-script",
                        severity: IssueSeverity.fromThresholds(s.length, ...thresholds.size),
                        details: `<code>script:not([src]):nth-of-type(${i})</code> (${units.bytes(s.length)})`
                    })),
                {
                    id: "reduce-scripts-count",
                    severity: IssueSeverity.fromThresholds(scriptsCount, ...thresholds.count),
                    details: `${scriptsCount} scripts`,
                    occurrences: scriptsCount < thresholds.count[0] ? 0 : 1
                },
                ...extScripts
                    .filter(s => s.bodyLength >= thresholds.size[0])
                    .map(s => ({
                        id: "reduce-script-size",
                        severity: IssueSeverity.fromThresholds(s.bodyLength, ...thresholds.size),
                        details: `<a href="${s.response.url()}">${s.response.url()}</a> (${units.bytes(s.bodyLength)})`
                    })),
                ...embScripts
                    .filter(s => s.length >= thresholds.size[0])
                    .map((s, i) => ({
                        id: "reduce-script-size",
                        severity: IssueSeverity.fromThresholds(s.length, ...thresholds.size),
                        details: `<code>script:not([src]):nth-of-type(${i})</code> (${units.bytes(s.length)})`
                    }))
            ]
        };
    }

}

/**
 * Check whether the request/response is a script request/response or not.
 * @param res Page response
 * @returns true if the response is a script response
 */
function isScript(res: ResponseArtifact) {
    return res.bodyLength > 0 && res.response.status() < 300 && !res.servedFromCache
        && (res.response.headers()["content-type"]?.includes("text/javascript")
            || res.response.url()?.match(/\.m?js$/));
}
