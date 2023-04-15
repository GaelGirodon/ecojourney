import * as units from "../../../../util/units.js";
import { PageArtifact, ResponseArtifact } from "../../../collection/artifact.js";
import { IssueSeverity } from "../../issue.js";
import { PageAnalyser } from "../analyser.js";
import { isMinified } from "../util.js";

const thresholds = {
    count: [3, 6, 12],
    size: [5, 50, 500].map(s => s * 1024)
};

export default class StylesheetsPageAnalyser extends PageAnalyser {

    async analyse(page: PageArtifact) {
        const extStyles = page.responses.filter(r => isStyle(r));
        const extStylesSize = extStyles.map(r => r.bodyLength)
            .reduce((sum, size) => sum + size, 0);
        const embStyles = await page.frame.locator("style").allInnerTexts();
        const embStylesSize = embStyles.map(r => r.length)
            .reduce((sum, size) => sum + size, 0);
        const stylesCount = extStyles.length + embStyles.length;
        const hasPrintStyles = await page.frame.locator("style[media~='print']").count() > 0
            || await page.frame.locator("link[rel='stylesheet'][media~='print']").count() > 0
            || extStyles.some(s => s.body?.toString("utf8").match(/@media[^{]+print/))
            || embStyles.some(s => s.toString().match(/@media[^{]+print/));

        return {
            measures: {
                "external-styles-count": { value: extStyles.length },
                "external-styles-size": { value: extStylesSize },
                "embedded-styles-count": { value: embStyles.length },
                "embedded-styles-size": { value: embStylesSize }
            },
            issues: [
                ...embStyles
                    .map((s, i) => ({
                        id: "externalise-style",
                        severity: IssueSeverity.fromThresholds(s.length, ...thresholds.size),
                        details: `<code>style:nth-of-type(${i})</code> (${units.bytes(s.length)})`
                    })),
                ...extStyles
                    .filter(s => !isMinified(s.body?.toString("utf8")))
                    .map(s => ({
                        id: "minify-style",
                        severity: IssueSeverity.fromThresholds(s.bodyLength, ...thresholds.size),
                        details: `<a href="${s.response.url()}">${s.response.url()}</a> (${units.bytes(s.bodyLength)})`
                    })),
                ...embStyles
                    .filter(s => !isMinified(s))
                    .map((s, i) => ({
                        id: "minify-style",
                        severity: IssueSeverity.fromThresholds(s.length, ...thresholds.size),
                        details: `<code>style:nth-of-type(${i})</code> (${units.bytes(s.length)})`
                    })),
                {
                    id: "provide-print-style",
                    severity: IssueSeverity.Info,
                    occurrences: hasPrintStyles ? 0 : 1
                },
                {
                    id: "reduce-styles-count",
                    severity: IssueSeverity.fromThresholds(stylesCount, ...thresholds.count),
                    details: `${stylesCount} style sheets`,
                    occurrences: stylesCount < thresholds.count[0] ? 0 : 1
                },
                ...extStyles
                    .filter(s => s.bodyLength >= thresholds.size[0])
                    .map(s => ({
                        id: "reduce-style-size",
                        severity: IssueSeverity.fromThresholds(s.bodyLength, ...thresholds.size),
                        details: `<a href="${s.response.url()}">${s.response.url()}</a> (${units.bytes(s.bodyLength)})`
                    })),
                ...embStyles
                    .filter(s => s.length >= thresholds.size[0])
                    .map((s, i) => ({
                        id: "reduce-style-size",
                        severity: IssueSeverity.fromThresholds(s.length, ...thresholds.size),
                        details: `<code>style:nth-of-type(${i})</code> (${units.bytes(s.length)})`
                    }))
            ]
        };
    }

}

/**
 * Check whether the request/response is a style sheet request/response or not.
 * @param res Page response
 * @returns true if the response is a style sheet response
 */
function isStyle(res: ResponseArtifact) {
    return res.bodyLength > 0 && res.response.status() < 300 && !res.servedFromCache
        && (res.response.headers()["content-type"]?.includes("text/css")
            || res.response.url()?.match(/\.css$/));
}
