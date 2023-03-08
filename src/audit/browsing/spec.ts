/**
 * Action specification in a manifest file
 */
export interface ActionSpec {

    /**
     * Action definition
     *
     * - Using short format:
     *
     * ```yaml
     * action: value1, value2
     * ```
     *
     * - Or long format:
     *
     * ```yaml
     * action:
     *   key1: value1
     *   key2: value2
     * ```
     */
    [key: string]: string | undefined | {
        [key: string]: string;
    };

}
