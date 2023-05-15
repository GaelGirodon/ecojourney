/*
 * An implementation of the EcoIndex calculation algorithm for internal use only
 * (to avoid adding a dependency for a feature that fits in a single file),
 * inspired by the following projects:
 * - EcoIndex: https://github.com/cnumr/ecoindex_node (MIT License)
 * - EcoIndex Python: https://github.com/cnumr/ecoindex_python (CC BY-NC-ND License)
 */

/**
 * Quantiles computed from the HTTP Archive database
 */
const quantiles = {
    dom: [0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076, 1237, 1459, 1801, 2479, 594601],
    req: [0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170, 205, 281, 3920],
    size: [0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47, 1448.32, 1648.27, 1876.08, 2142.06, 2465.37, 2866.31, 3401.59, 4155.73, 5400.08, 8037.54, 223212.26]
};

/**
 * Get the quantile of a value in given quantiles.
 * @param quantiles Quantiles
 * @param value The value to search
 * @returns The quantile
 */
function getQuantile(quantiles: number[], value: number): number {
    for (let i = 1; i < quantiles.length + 1; i++) {
        if (value < quantiles[i]) {
            return i - 1 + (value - quantiles[i - 1]) / (quantiles[i] - quantiles[i - 1]);
        }
    }
    return quantiles.length - 1;
}

/**
 * Compute the EcoIndex score.
 * @param dom The number of HTML elements in the page DOM
 * @param size The page total size (sum of responses size in kB)
 * @param req The number of requests
 * @returns The EcoIndex score (between 0 and 100, worst to best)
 */
function getScore(dom: number, size: number, req: number): number {
    const qDom = getQuantile(quantiles.dom, dom);
    const qSize = getQuantile(quantiles.size, size);
    const qReq = getQuantile(quantiles.req, req);
    return Math.round(100 - 5 * (3 * qDom + 2 * qReq + qSize) / 6);
}

/**
 * EcoIndex response structure
 */
export interface EcoIndex {
    /** The score */
    readonly score: number;
    /** The grade letter */
    readonly grade: string;
    /** The quantity of greenhouse gases emission (gCO2e) */
    readonly ges: number;
    /** The quantity of water consumption (cl) */
    readonly water: number;
}

/**
 * Compute the EcoIndex from page statistics.
 * @param dom The number of HTML elements in the page DOM
 * @param size The page total size (sum of responses size in kB)
 * @param req The number of requests
 * @returns The EcoIndex
 */
export function getEcoIndex(dom: number, size: number, req: number): EcoIndex {
    const score = getScore(dom, size, req)
    return {
        score,
        grade: getGrade(score),
        ges: getGreenhouseGasesEmission(score),
        water: getWaterConsumption(score),
    };
}

/**
 * Get the grade letter associated to the given score.
 * @param score The EcoIndex computed score
 * @returns The grade letter
 */
function getGrade(score: number): string {
    if (score > 80) return "A";
    if (score > 70) return "B";
    if (score > 55) return "C";
    if (score > 40) return "D";
    if (score > 25) return "E";
    if (score > 10) return "F";
    return "G";
}

/**
 * Get the quantity of greenhouse gases emission
 * associated to the given score.
 * @param score The EcoIndex computed score
 * @returns The quantity of greenhouse gases emission (gCO2e)
 */
function getGreenhouseGasesEmission(score: number): number {
    return Math.round(100 * (2 + 2 * (50 - score) / 100)) / 100;
}

/**
 * Get the quantity of water consumption
 * associated to the given score.
 * @param score The EcoIndex computed score
 * @returns The quantity of water consumption (cl)
 */
function getWaterConsumption(score: number): number {
    return Math.round(100 * (3 + 3 * (50 - score) / 100)) / 100;
}
