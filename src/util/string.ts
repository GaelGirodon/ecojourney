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
 * Return a copy of the string, in lowercase and with everything
 * except 0-9 and a-z replaced with -.
 * @param str The source string
 * @returns The slug
 */
export function slugify(str: string) {
    return !str ? "" : str.toLowerCase()
        .replace(/[^\w-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
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

/**
 * Escape the given characters in the string.
 * @param str The input string
 * @param chars Characters to escape (properly escaped themselves to be
 * injected into a regex character class)
 * @param prefix String to add before each character to escape
 * @returns The string with characters escaped
 */
export function escapeChars(str: string, chars: string, prefix = "\\") {
    return str?.replace(new RegExp(`([${chars}])`, "g"), `${prefix}$1`);
}
