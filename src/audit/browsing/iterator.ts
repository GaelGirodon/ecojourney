import log from "../../util/log.js";
import { Context } from "../context.js";
import { Action } from "./action.js";

/**
 * Action iterator
 */
export class ActionIterator {

    /** Index of the next action to run */
    private index = 0;

    constructor(
        /** Actions to iterate through */
        readonly actions: Action[]
    ) { }

    /**
     * Check whether the iterator has more actions.
     * @returns true if the iterator has more actions
     */
    public hasNext(): boolean {
        return this.index < this.actions.length;
    }

    /**
     * Iterate to the next action and run it.
     * @param ctx The context
     * @returns The next action
     */
    public async runNext(ctx: Context) {
        const action = this.actions[this.index++];
        log.debug("Run action %s (#%d)", action.constructor.name, this.index);
        const output = await action.run(ctx);
        return { action, output };
    }

}
