import * as units from "../../../../util/units.js";
import { PageArtifact, ResponseArtifact } from "../../../collection/artifact.js";
import { IssueSeverity } from "../../issue.js";
import { PageAnalyser } from "../analyser.js";
import { isMinified } from "../util.js";

/** Severity thresholds per measure and image type */
const thresholds = {
    raster: {
        size: [10, 100, 500].map(s => s * 1024),
        resizeRatio: [0.2, 0.5, 0.8]
    },
    vector: {
        size: [5, 50, 100].map(s => s * 1024)
    }
};

export default class ImagesPageAnalyser extends PageAnalyser {

    async analyse(page: PageArtifact) {
        // Gather measures
        const rasterImageRequests = page.responses.filter(r => isRasterImage(r));
        const rasterImageRequestsSize = rasterImageRequests.map(r => r.bodyLength)
            .reduce((sum, size) => sum + size, 0);
        const vectorImageRequests = page.responses.filter(r => isVectorImage(r));
        const vectorImageRequestsSize = vectorImageRequests.map(r => r.bodyLength)
            .reduce((sum, size) => sum + size, 0);
        const displayedImages = await page.frame.evaluate(() =>
            ([...document.querySelectorAll("img:not([src^='data'])")] as HTMLImageElement[])
                .map(img => ({
                    src: img.src,
                    clientWidth: img.clientWidth, clientHeight: img.clientHeight,
                    naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight,
                    resizeRatio: (img.clientWidth * img.clientHeight) / (img.naturalWidth * img.naturalHeight)
                }))
        ).catch(() => []);

        return {
            measures: {
                "raster-images-count": { value: rasterImageRequests.length },
                "raster-images-size": { value: rasterImageRequestsSize },
                "vector-images-count": { value: vectorImageRequests.length },
                "vector-images-size": { value: vectorImageRequestsSize },
            },
            issues: [
                ...rasterImageRequests
                    .filter(r => r.bodyLength >= thresholds.raster.size[0])
                    .map(r => ({
                        id: "optimise-image",
                        severity: IssueSeverity.fromThresholds(r.bodyLength, ...thresholds.raster.size),
                        details: `<a href="${r.response.url()}">${r.response.url()}</a> (${units.bytes(r.bodyLength)})`
                    })),
                ...vectorImageRequests
                    .filter(r => !isVectorImageOptimised(r.body?.toString("utf8")))
                    .map(r => ({
                        id: "optimise-vector-image",
                        severity: IssueSeverity.fromThresholds(r.bodyLength, ...thresholds.vector.size),
                        details: `<a href="${r.response.url()}">${r.response.url()}</a> (${units.bytes(r.bodyLength)})`
                    })),
                ...displayedImages
                    .filter(i => !i.src.endsWith(".svg") && i.resizeRatio > 0 && i.resizeRatio < 1)
                    .map(i => ({
                        id: "serve-right-sized-image",
                        severity: IssueSeverity.fromThresholds(1 - i.resizeRatio, ...thresholds.raster.resizeRatio),
                        details: `<a href="${i.src}">${i.src}</a>`
                    }))
            ]
        };
    }

}

/**
 * Check whether the request/response is a raster image request/response or not.
 * @param res Page response
 * @returns true if the response is a raster image response
 */
function isRasterImage(res: ResponseArtifact) {
    return res.bodyLength > 0 && res.response.status() < 300 && !res.servedFromCache
        && (res.response.headers()["content-type"]?.startsWith("image/")
            && !res.response.headers()["content-type"]?.startsWith("image/svg")
            || res.response.url()?.match(/\.(avif|bmp|gif|ico|jpe?g|png|tiff|webp)$/));
}

/**
 * Check whether the request/response is a vector image request/response or not.
 * @param res Page response
 * @returns true if the response is a vector image response
 */
function isVectorImage(res: ResponseArtifact) {
    return res.bodyLength > 0 && res.response.status() < 300 && !res.servedFromCache
        && (res.response.headers()["content-type"]?.startsWith("image/svg")
            || res.response.url()?.match(/\.svg$/));
}

/**
 * Check whether the given vector image seems to be optimised or not.
 * @param svg The SVG image
 * @returns true if the vector image seems to be optimised
 */
function isVectorImageOptimised(svg: string | undefined) {
    return !svg || isMinified(svg, "xml")
        && svg.match(/(<!-- |<\?xml |\n {4,}<)/) === null;
}
