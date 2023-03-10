import log from "../../../util/log.js";
import { Context } from "../../context.js";
import { Action, ActionProperties } from "../action.js";
import { render } from "../template.js";

/**
 * Mark the current state as a stable page to analyse.
 */
export class PageAction extends Action {

    /** The page name */
    readonly name: string;

    constructor(props: ActionProperties) {
        super();
        this.name = Array.isArray(props) ? props[0] : props.name;
    }

    async run(ctx: Context) {
        const name = render(this.name, ctx.data(this.args));
        log.info("Mark page '%s' to analyse", name);
        await ctx.page().waitForLoadState("networkidle");
        return { name };
    }

}
