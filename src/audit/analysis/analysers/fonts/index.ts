import * as units from "../../../../util/units.js";
import { PageArtifact, ResponseArtifact } from "../../../collection/artifact.js";
import { IssueSeverity } from "../../issue.js";
import { PageAnalyser } from "../analyser.js";

/** Severity thresholds */
const thresholds = {
    size: [5, 50, 500].map(s => s * 1024)
};

export default class FontsPageAnalyser extends PageAnalyser {

    async analyse(page: PageArtifact) {
        // Gather measures
        const fontRequests = page.responses.filter(r => isFont(r));
        const fontRequestsSize = fontRequests.map(r => r.bodyLength)
            .reduce((sum, size) => sum + size, 0);

        return {
            measures: {
                "external-fonts-count": { value: fontRequests.length },
                "external-fonts-size": { value: fontRequestsSize }
            },
            issues: fontRequests.map(r => ({
                id: "use-standard-fonts",
                severity: IssueSeverity.fromThresholds(r.bodyLength, ...thresholds.size),
                details: `<a href="${r.response.url()}">${r.response.url()}</a> (${units.bytes(r.bodyLength)})`
            }))
        };
    }

}

/**
 * Check whether the request/response is a font request/response or not.
 * @param res Page response
 * @returns true if the response is a font response
 */
function isFont(res: ResponseArtifact) {
    if (res.bodyLength <= 0 || res.response.status() >= 300 || res.servedFromCache) {
        return false;
    }
    const contentType = res.response.headers()["content-type"];
    return contentType?.includes("font")
        || !contentType && res.response.url()?.match(/\.(ttf|otf|woff2?)$/);
}
