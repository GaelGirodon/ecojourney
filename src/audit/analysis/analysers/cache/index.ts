import * as units from "../../../../util/units.js";
import { PageArtifact, ResponseArtifact } from "../../../collection/artifact.js";
import { IssueSeverity } from "../../issue.js";
import { PageAnalyser, PageAnalyserResult } from "../analyser.js";
import { isStatic } from "../util.js";

/** Severity thresholds */
const thresholds = {
    size: [5, 50, 500].map(s => s * 1024)
};

export default class CachePageAnalyser extends PageAnalyser {

    async analyse(page: PageArtifact): Promise<PageAnalyserResult> {
        const requests = page.responses
            .filter(r => isStatic(r))
            .map(r => ({ ...r, cache: getCacheConfig(r) }));

        return {
            issues: [
                ...requests
                    .filter(r => !r.cache.hasCacheControlMaxAge)
                    .map(r => ({
                        id: "configure-cache-headers",
                        severity: IssueSeverity.fromThresholds(r.bodyLength, ...thresholds.size).shift(r.cache.severityOffset),
                        details: `${r.cache.hasETagOrLastModified ? "<code>max-age</code>" : "Cache configuration"
                            } missing for <a href="${r.response.url()}">${r.response.url()}</a> (${units.bytes(r.bodyLength)})`
                    }))
            ]
        };
    }

}

/**
 * Check request/response HTTP cache headers.
 * @param res Page response
 * @returns The cache configuration
 */
function getCacheConfig(res: ResponseArtifact) {
    const headers = res.response.headers();
    const hasCacheControlMaxAge = headers["cache-control"]
        && !/(no-cache|no-store|max-age\s*=\s*0)/.test(headers["cache-control"])
        || headers["expires"] && new Date(headers["expires"]) > new Date();
    const hasETagOrLastModified = headers["etag"] || headers["last-modified"];
    return {
        hasCacheControlMaxAge, hasETagOrLastModified,
        severityOffset: hasCacheControlMaxAge ? -100
            : (hasETagOrLastModified ? -1 : 0)
    };
}
