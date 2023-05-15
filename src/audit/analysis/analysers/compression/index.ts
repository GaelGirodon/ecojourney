import * as units from "../../../../util/units.js";
import { PageArtifact, ResponseArtifact } from "../../../collection/artifact.js";
import { IssueSeverity } from "../../issue.js";
import { PageAnalyser } from "../analyser.js";
import { encodings, minLength, types } from "./constants.js";

/** Severity thresholds */
const thresholds = {
    size: [5, 50, 500].map(s => s * 1024)
};

export default class CompressionPageAnalyser extends PageAnalyser {

    async analyse(page: PageArtifact) {
        const compressibleRequests = page.responses
            .filter(r => shouldBeCompressed(r));

        return {
            measures: {
                "compressible-requests-count": { value: compressibleRequests.length }
            },
            issues: [
                ...compressibleRequests.map(r => ({
                    id: "enable-compression",
                    severity: IssueSeverity.fromThresholds(r.bodyLength, ...thresholds.size),
                    details: `<a href="${r.response.url()}">${r.response.url()
                        }</a> should be served with compression (${units.bytes(r.bodyLength)})`
                }))
            ]
        };
    }

}

/**
 * Check whether the request/response should be compressed but it isn't.
 * @param res Page response
 * @returns true if the response should be compressed but it isn't
 */
function shouldBeCompressed(res: ResponseArtifact) {
    if (res.bodyLength < minLength || res.response.status() >= 300 || res.servedFromCache) {
        return false;
    }
    const { "content-encoding": enc, "content-type": typ } = res.response.headers();
    return types.includes(typ) && !(enc && encodings.some(e => enc.includes(e)));
}
