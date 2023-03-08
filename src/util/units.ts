/**
 * Format a value provided in bytes.
 * @param value The value in bytes to format
 * @returns The formatted value with unit
 */
export function bytes(value: number) {
    const units = ["B", "kB", "MB", "GB", "TB"];
    let i = 0;
    for (; value >= 1000 && i + 1 < units.length; i++, value /= 1000);
    return `${round(value, 2)} ${units[i]}`;
}

/**
 * Format a value provided in seconds.
 * @param value The value in seconds to format
 * @returns The formatted value with unit
 */
export function seconds(value: number) {
    return value < 1 ? `${value * 1000} ms` : `${value} s`;
}

/**
 * Round the value to the given scale.
 * @param value The value to round
 * @param scale The output number of digits to the right of the decimal point
 * @returns The rounded value
 */
export function round(value: number, scale = 0): number {
    return +value.toFixed(scale);
}
