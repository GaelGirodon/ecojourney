import { groupReduce } from "../../../../util/object.js";
import * as units from "../../../../util/units.js";
import { PageArtifact } from "../../../collection/artifact.js";
import { IssueSeverity } from "../../issue.js";
import { PageAnalyser, PageAnalyserResult } from "../analyser.js";
import { isStatic } from "../util.js";

/** Severity thresholds */
const thresholds = {
    length: [32, 128, 512, 2048]
};

export default class CookiesPageAnalyser extends PageAnalyser {

    async analyse(page: PageArtifact): Promise<PageAnalyserResult> {
        // Collect requests with cookies
        const requests = (await Promise.all(page.responses
            .map(r => r.response.request().allHeaders()
                .then(h => ({ ...r, cookie: h["cookie"] })))))
            .filter(r => r.cookie);
        const requestsByCookie = groupReduce(requests.map(r => r.cookie),
            c => c, () => 0, (requests: number) => requests + 1);

        return {
            issues: [
                ...Object.entries(requestsByCookie).map(([cookie, requests]) => ({
                    id: "optimise-cookies",
                    severity: IssueSeverity.fromThresholds(cookie.length, ...thresholds.length.slice(1)),
                    details: `${cookie.split(";").map(c => `<code>${c.split("=")[0]?.trim()}</code>`).join(" ")
                        } (${units.bytes(cookie.length)})`,
                    occurrences: cookie.length < thresholds.length[0] ? 0 : requests
                })),
                ...requests
                    .filter(r => isStatic(r))
                    .map(r => ({
                        id: "no-cookie-for-static-resource",
                        severity: IssueSeverity.fromThresholds(r.cookie.length, ...thresholds.length.slice(1)),
                        details: `<a href="${r.response.url()}">${r.response.url()}</a> (${units.bytes(r.cookie.length)})`,
                        occurrences: r.cookie.length < thresholds.length[0] ? 0 : 1
                    }))
            ]
        };
    }

}
