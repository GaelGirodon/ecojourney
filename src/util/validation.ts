/**
 * Check whether the given value is a valid HTTP(S) URL
 * @param value The value to check
 * @returns true if the value is a valid URL
 */
export function isHttpUrl(value: string): boolean {
    try {
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol);
    } catch (_) { }
    return false;
}
