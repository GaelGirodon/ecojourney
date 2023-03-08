import { PageArtifact } from "../../../collection/artifact.js";
import { IssueSeverityBuilder } from "../../issue.js";
import { PageAnalyser } from "../analyser.js";

const sizeThresholds = [5, 50, 500].map(s => s * 1024);

export default class EmbeddedAssetsPageAnalyser extends PageAnalyser {

    async analyse(page: PageArtifact) {
        const embeddedStyles = await page.frame.locator("style").allInnerTexts();
        const embeddedScripts = await page.frame.locator("script:not([src])").allInnerTexts();
        return {
            measures: {
                "embedded-styles": { value: embeddedStyles.length },
                "embedded-scripts": { value: embeddedScripts.length }
            },
            issues: [
                ...embeddedStyles.map((s, i) => ({
                    id: "externalise-style",
                    element: `style:nth-of-type(${i})`,
                    severity: IssueSeverityBuilder.fromThresholds(s.length, ...sizeThresholds),
                    occurrences: 1
                })),
                ...embeddedScripts.map((s, i) => ({
                    id: "externalise-script",
                    element: `script:not([src]):nth-of-type(${i})`,
                    severity: IssueSeverityBuilder.fromThresholds(s.length, ...sizeThresholds),
                    occurrences: 1
                }))
            ]
        };
    }

}
