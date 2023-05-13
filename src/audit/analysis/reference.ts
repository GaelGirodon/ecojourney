/**
 * An external reference a rule is associated with
 */
export class Reference {

    constructor(
        /** Identifier */
        readonly id: string,
        /** Display name */
        readonly name: string,
        /** Link URL */
        readonly url?: string
    ) { }

    /**
     * Expand a reference shortcut notation.
     * @param id Reference shortcut notation
     * @returns The reference
     */
    static expand(id: string | Reference): Reference {
        if (typeof id !== "string") {
            return id;
        }
        const source = id.split("#")[0];
        return sources[source]?.expand(id);
    }

}

/**
 * A reference source
 */
export interface ReferenceSource {

    /**
     * Expand a reference shortcut notation.
     * @param id Reference shortcut notation
     * @returns The reference
     */
    expand(id: string | Reference): Reference;

}

/**
 * 115 web eco-design best practices
 */
class WebEcoDesignBestPracticesReferenceSource implements ReferenceSource {

    /**
     * @inheritdoc
     */
    expand(id: string | Reference): Reference {
        if (typeof id !== "string") {
            return id;
        }
        return new Reference(id, `115 Best Practices #${id.split("#")[1]}`)
    }

}

/**
 * Available reference sources
 */
const sources: { [key: string]: ReferenceSource } = {
    "115bp": new WebEcoDesignBestPracticesReferenceSource()
}
