import { ResponseArtifact } from "../../collection/artifact.js";

/**
 * Check whether some CSS, JS or XML code seems to be minified or not.
 * @param code CSS, JS or XML code
 * @returns true if content seems to be minified
 */
export function isMinified(code: string | undefined, type: "css" | "js" | "xml" = "css") {
    if (!code) return true;
    const lf = count(code, "\n");
    const sep = type === "xml" ? ">" : ";";
    return lf < 2 || count(code, sep) > lf || code.length / lf > 100;
}

/**
 * Count the number of substring occurrences.
 * @param str The string to search in
 * @param sub The string to search for
 * @param limit Stop counting after a given number of occurrences
 * @returns The number of substring occurrences
 */
export function count(str: string, sub: string, limit: number = Number.MAX_SAFE_INTEGER) {
    if (!str || !sub) return 0;
    let c = 0;
    for (let i = 0; i !== -1 && c - 1 < limit; i = ` ${str}`.indexOf(sub, i + 1), c++);
    return c - 1;
}

/**
 * Check whether the request/response is a static resource request/response or not.
 * @param res Page response
 * @returns true if the response is a static resource response
 */
export function isStatic(res: ResponseArtifact) {
    return res.bodyLength > 0 && res.response.status() < 300 && !res.servedFromCache
        && [/^image\//, /^audio\//, /\/ogg$/, /^video\//, /css/,
            /javascript/, /font/, /manifest/, /\/pdf/, /\/zip/]
            .some(r => r.test(res.response.headers()["content-type"]));
}
