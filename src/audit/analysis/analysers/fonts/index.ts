import { PageArtifact, ResponseArtifact } from "../../../collection/artifact.js";
import { IssueSeverityBuilder } from "../../issue.js";
import { PageAnalyser } from "../analyser.js";

const sizeThresholds = [5, 50, 500].map(s => s * 1024);

export default class FontsPageAnalyser extends PageAnalyser {

    async analyse(page: PageArtifact) {
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
                severity: IssueSeverityBuilder.fromThresholds(r.bodyLength, ...sizeThresholds),
                element: r.response.url(),
                occurrences: 1
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
    const headers = res.response.headers();
    return res.bodyLength > 0 && (headers["content-type"]?.includes("font")
        || res.response.url()?.match(/\.(ttf|otf|woff2?)$/));
}
