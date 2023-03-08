import log from "../../util/log.js";
import { Context } from "../context.js";
import { Action } from "./action.js";
import { ProcedureAction } from "./actions/procedure.js";
import { renderObject } from "./template.js";

/**
 * Action iterator with procedures support
 */
export class ActionIterator {

    /** Index of the next action to run */
    private index = 0;

    /** Current procedure */
    private procedure?: {
        /** Procedure name */
        name: string,
        /** Procedure actions */
        actions: Action[],
        /** Procedure call arguments */
        args: { [key: string]: string },
        /** Index of the next procedure action to run */
        index: number
    };

    constructor(
        /** Actions to iterate through */
        private actions: Action[],
        /** Reusable procedures */
        private procedures: { [name: string]: Action[]; } = {}
    ) { }

    /**
     * Check whether the iterator has more actions.
     * @returns true if the iterator has more actions
     */
    public hasNext(): boolean {
        return this.index < this.actions.length || this.procedure !== undefined
            && this.procedure.index < this.procedure.actions.length;
    }

    /**
     * Iterate to the next action and run it.
     * @param globalCtx The context
     * @returns The next action
     */
    public async runNext(globalCtx: Context) {
        let ctx = globalCtx;
        let action = this.actions[this.index];
        if (this.procedure === undefined && action instanceof ProcedureAction) {
            // Entering a procedure
            this.procedure = {
                name: action.name,
                actions: this.procedures[action.name],
                args: action.args,
                index: 0
            };
        }
        if (this.procedure !== undefined && this.procedure.index < this.procedure.actions.length) {
            // Running actions from a procedure
            action = this.procedure.actions[this.procedure.index++];
            ctx = ctx.withData({ args: renderObject(this.procedure.args, ctx.templateData()) });
        } else {
            if (this.procedure !== undefined) {
                // Exiting a procedure
                this.procedure = undefined;
                this.index++;
            }
            // Running first-level actions
            action = this.actions[this.index++];
        }
        log.debug("Run action %s (%d#%d)", action.constructor.name,
            this.index, this.procedure?.index ?? 0);
        const output = await action.run(ctx);
        return { action, output };
    }

}
