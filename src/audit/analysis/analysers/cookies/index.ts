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
        const cookies = requests.map(r => r.cookie)
            .reduce((cookies: { [cookie: string]: { requests: number, names: string[] } }, cookie) => {
                cookies[cookie] = {
                    requests: (cookies[cookie]?.requests ?? 0) + 1,
                    names: cookies[cookie]?.names ?? cookie.split(";")
                        .map(c => c.split("=")[0].trim())
                };
                return cookies;
            }, {});

        return {
            issues: [
                ...Object.entries(cookies).map(([cookie, c]) => ({
                    id: "optimise-cookies",
                    severity: IssueSeverity.fromThresholds(cookie.length, ...thresholds.length.slice(1)),
                    details: `${c.names.map(n => `<code>${n}</code>`).join(" ")} (${units.bytes(cookie.length)})`,
                    occurrences: cookie.length < thresholds.length[0] ? 0 : c.requests
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
