/**
 * Create an object composed of the picked object keys.
 * @param object The source object
 * @param keys The keys to pick
 * @returns The new object
 */
export function pick(object: { [key: string]: any }, keys: string[]) {
    const output: { [key: string]: any } = {};
    for (const k of keys) {
        if (object.hasOwnProperty(k) || object[k] !== undefined) {
            output[k] = object[k];;
        }
    }
    return output;
}

/**
 * Create an object composed of the object keys that are not omitted.
 * @param object The source object
 * @param keys The keys to omit
 * @returns The new object
 */
export function omit(object: { [key: string]: any }, keys: string[]) {
    const output: { [key: string]: any } = Object.assign({}, object);
    for (const k of keys) {
        delete output[k];
    }
    return output;
}
