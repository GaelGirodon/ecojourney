import { Context } from "../context.js";

/**
 * Action in a simulated browsing scenario.
 */
export abstract class Action {

    constructor(
        /** Action description */
        public readonly description: string | undefined
    ) { };


    /**
     * Run the action on the given context.
     * @param _ctx The context
     * @returns Nothing or processed params
     */
    abstract run(_ctx: Context): Promise<void | { [key: string]: any }>;

}

/**
 * Action properties from the manifest file
 */
export type ActionProperties = { [key: string]: any } | string[];
