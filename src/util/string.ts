/**
 * Return a copy of the string with the first letter uppercased.
 * @param str The source string
 * @returns The capitalised string
 */
export function capitalise(str: string) {
    if (!str || str.length === 0) {
        return str;
    }
    return str[0].toUpperCase() + str.slice(1);
}

/**
 * Return a copy of the string with the first letter lowercased.
 * @param str The source string
 * @returns The uncapitalised string
 */
export function uncapitalise(str: string) {
    if (!str || str.length === 0) {
        return str;
    }
    return str[0].toLowerCase() + str.slice(1);
}

/**
 * Return a copy of the string with trailing dots removed.
 * @param str The source string
 * @returns The uncapitalised string
 */
export function trimEndDot(str: string) {
    if (!str || str.length === 0) {
        return str;
    }
    return str.replace(/\.+$/, "");
}
