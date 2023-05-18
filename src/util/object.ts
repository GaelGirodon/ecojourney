/**
 * Test whether the input value is an object or not.
 * @param v The value to test
 * @returns true if the value is an object
 */
export function isObject(v: any): boolean {
    return !!v && typeof v === "object" && !Array.isArray(v);
}

/**
 * Create an object composed of the picked object keys.
 * @param object The source object
 * @param keys The keys to pick
 * @returns The new object
 */
export function pick<T extends Object, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
    const output: T = {} as T;
    for (const k of keys) {
        if (Object.hasOwn(object, k) || object[k] !== undefined) {
            output[k] = object[k];
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
export function omit<T extends Object, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
    const output: T = Object.assign({}, object);
    for (const k of keys) {
        delete output[k];
    }
    return output;
}

/**
 * Merge multiple objects deeply.
 * @param objects Objects to merge
 * @returns The merged object
 */
export function merge(...objects: any[]): any {
    const target: any = {};
    for (const src of objects) {
        for (const key of Object.keys(src)) {
            target[key] = isObject(target[key]) && isObject(src[key])
                ? merge(target[key], src[key])
                : src[key];
        }
    }
    return target;
}

/**
 * Group elements by a key and aggregate them.
 * @param collection Source collection
 * @param keyExtractor Extract the key to group by from a collection element
 * @param factory Create a new aggregated value
 * @param aggregator Add an element to an aggregated value
 * @returns The result object indexed by keys with aggregated values
 */
export function groupReduce<E, V>(
    collection: E[],
    keyExtractor: (element: E) => string,
    factory: () => V,
    accumulator: (previousValue: V, element: E) => V
): { [key: string]: V } {
    const map: { [key: string]: V } = {};
    for (const el of collection) {
        const key = keyExtractor(el);
        if (!map[key]) {
            map[key] = factory();
        }
        map[key] = accumulator(map[key], el);
    }
    return map;
}
