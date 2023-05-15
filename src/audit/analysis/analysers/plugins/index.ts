import { PageArtifact, ResponseArtifact } from "../../../collection/artifact.js";
import { IssueSeverity } from "../../issue.js";
import { PageAnalyser } from "../analyser.js";

export default class PluginsPageAnalyser extends PageAnalyser {

    async analyse(page: PageArtifact) {
        const socialPluginRequests = page.responses
            .filter(r => isSocialPlugin(r));

        return {
            measures: {
                "social-plugins-count": { value: socialPluginRequests.length }
            },
            issues: [
                ...socialPluginRequests.map(r => ({
                    id: "avoid-social-plugin",
                    severity: IssueSeverity.Minor,
                    details: `<a href="${r.response.url()}">${r.response.url()}</a>`
                }))
            ]
        };
    }

}

/**
 * Check whether the request/response is a social plugin request or not.
 * @param res Page response
 * @returns true if the response is a social plugin response
 */
function isSocialPlugin(res: ResponseArtifact) {
    const url = res.response.url();
    return res.bodyLength > 0 && res.response.status() < 300 && !res.servedFromCache
        && url && [
            /platform\.twitter\.com\/widgets\.js/,             // Twitter
            /connect\.facebook\.net\/.+sdk\.js/,               // Facebook
            /assets\.pinterest\.com\/js\/pinit\.js/,           // Pinterest
            /platform\.linkedin\.com\/in\.js/,                 // LinkedIn
            /platform-api\.sharethis\.com\/js\/sharethis\.js/, // ShareThis
            /s7\.addthis\.com\/js\/\d+\/addthis_widget\.js/,   // AddThis
            /static\.addtoany\.com\/menu\/page\.js/,           // AddToAny
            /apps\.elfsight\.com\/p\/platform\.js/             // ElfSight
        ].some(m => url.match(m));
}
