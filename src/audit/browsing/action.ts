import { Context } from "../context.js";

/**
 * Action in a simulated browsing scenario.
 */
export abstract class Action {

    /** Action arguments from the parent procedure */
    public args: ActionArguments = {};

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

/**
 * Action arguments from the parent procedure
 */
export type ActionArguments = { [key: string]: any };
