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
     * @param ref Reference shortcut notation
     * @returns The reference
     */
    static expand(ref: string | Reference): Reference {
        if (typeof ref !== "string") {
            return ref;
        }
        const source = ref.split("#")[0];
        return sources[source]?.expand(ref);
    }

}

/**
 * A reference source
 */
export interface ReferenceSource {

    /**
     * Expand a reference shortcut notation.
     * @param ref Reference shortcut notation
     * @returns The reference
     */
    expand(ref: string | Reference): Reference;

}

/**
 * 115 web eco-design best practices
 */
class WebEcoDesignBestPracticesReferenceSource implements ReferenceSource {

    /**
     * @inheritdoc
     */
    expand(ref: string | Reference): Reference {
        if (typeof ref !== "string") {
            return ref;
        }
        const segments = ref.split("#");
        if (segments.length <= 1) {
            return new Reference(ref, "115 Best Practices",
                "https://github.com/cnumr/best-practices");
        }
        const ids = segments[1].split("-");
        if (ids.length <= 1) {
            return new Reference(ref, `115 Best Practices #${ids[0]}`);
        }
        const id = ids[1].padStart(3, "0");
        const url = `https://github.com/cnumr/best-practices/blob/main/chapters/BP_${id}_fr.md`;
        return new Reference(ref, `115 Best Practices #${ids[0]}`, url);
    }

}

/**
 * Available reference sources
 */
const sources: { [key: string]: ReferenceSource } = {
    "115bp": new WebEcoDesignBestPracticesReferenceSource()
}
