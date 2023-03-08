import log from "../../../util/log.js";
import { Context } from "../../context.js";
import { Action, ActionProperties } from "../action.js";

/**
 * Execute actions from a procedure.
 */
export class ProcedureAction extends Action {

    /** The procedure name */
    readonly name: string;

    /** Procedure arguments */
    readonly args: { [key: string]: string };

    constructor(description: string | undefined, props: ActionProperties) {
        super(description);
        this.name = Array.isArray(props) ? props[0] : props.name;
        this.args = !Array.isArray(props) ? (props.args ?? {}) : {};
    }

    async run(_ctx: Context) {
        log.info("Call procedure '%s'", this.name);
    }

}
