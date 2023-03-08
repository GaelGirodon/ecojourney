import { PageAnalyser } from "../analyser.js";
import { PageArtifact } from "../../../collection/artifact.js";
import { getEcoIndex } from "./ecoindex.js";

export default class EcoIndexPageAnalyser extends PageAnalyser {

    async analyse(page: PageArtifact) {
        const requestsCount = page.requests.length;
        let responsesSize = page.responses.map(r => r.bodyLength)
            .reduce((sum, size) => sum + size, 0);
        const domCount = await page.frame.locator("*").count();
        const ecoIndex = getEcoIndex(domCount, requestsCount, Math.round(responsesSize / 1024));
        return {
            measures: {
                "requests-count": { value: requestsCount },
                "responses-size": { value: responsesSize },
                "dom-elements-count": { value: domCount },
                "eco-index": { value: ecoIndex.score },
                "greenhouse-gases-emission": { value: ecoIndex.ges },
                "water-consumption": { value: ecoIndex.water }
            }
        };
    }

}
