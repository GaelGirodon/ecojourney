import { formatError } from "../../../../util/log.js";
import { PageArtifact } from "../../../collection/artifact.js";
import { IssueSeverity } from "../../issue.js";
import { PageAnalyser } from "../analyser.js";

export default class ErrorsPageAnalyser extends PageAnalyser {

    async analyse(page: PageArtifact) {
        const errorRequests = page.responses
            .filter(r => r.response.status() >= 400);

        return {
            measures: {
                "failed-requests-count": { value: errorRequests.length + page.failedRequests.length },
                "errors-count": { value: page.errors.length }
            },
            issues: [
                ...errorRequests.map(r => ({
                    id: "fix-error",
                    severity: IssueSeverity.Minor,
                    details: `${r.response.request().method()} <a href="${r.response.url()
                        }">${r.response.url()}</a> → ${r.response.status()}`
                })),
                ...page.failedRequests.map(r => ({
                    id: "fix-error",
                    severity: IssueSeverity.Minor,
                    details: `${r.request.method()} <a href="${r.request.url()
                        }">${r.request.url()}</a> → ${r.request.failure()?.errorText}`
                })),
                ...page.errors.map(err => ({
                    id: "fix-error",
                    severity: IssueSeverity.Minor,
                    details: formatError(err)
                }))
            ]
        };
    }

}
