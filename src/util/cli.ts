import { Option as CommanderOption } from "commander";

/**
 * A command-line option that supports a custom attribute name
 * (other than the camel-cased option name).
 */
export class Option extends CommanderOption {

    /** The custom attribute name */
    private _attributeName?: string;

    /**
     * Return the object attribute key name.
     * @returns The attribute name
     */
    attributeName(): string;

    /**
     * Set a custom name for the object attribute key.
     * @param str The custom attribute name
     * @returns this
     */
    attributeName(str: string): Option;

    attributeName(str?: string): string | Option {
        if (str !== undefined) {
            this._attributeName = str;
            return this;
        }
        return this._attributeName ?? super.attributeName();
    }

}
