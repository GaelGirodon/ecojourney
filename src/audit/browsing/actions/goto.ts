import log from "../../../util/log.js";
import { Context } from "../../context.js";
import { Action, ActionProperties } from "../action.js";

/**
 * Navigate to the given URL.
 */
export class GotoAction extends Action {

    /** The target HTTP/HTTPS URL */
    readonly url: string;

    constructor(props: ActionProperties) {
        super();
        this.url = Array.isArray(props) ? props[0] : props.url;
    }

    async run(ctx: Context) {
        log.info("Navigate to %s", this.url);
        await ctx.page().goto(this.url);
    }

}
