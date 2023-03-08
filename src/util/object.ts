/**
 * Create an object composed of the picked object properties.
 * @param object The source object
 * @param properties The properties to pick
 * @returns The new object
 */
export function pick(object: { [key: string]: any }, properties: string[]) {
    const output: { [key: string]: any } = {};
    for (const p of properties) {
        if (object.hasOwnProperty(p)) {
            output[p] = object[p];
        }
    }
    return output;
}

/**
 * Create an object composed of the object properties that are not omitted.
 * @param object The source object
 * @param properties The properties to omit
 * @returns The new object
 */
export function omit(object: { [key: string]: any }, properties: string[]) {
    const output: { [key: string]: any } = Object.assign({}, object);
    for (const p of properties) {
        delete output[p];
    }
    return output;
}
