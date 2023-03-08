import log from "../../../util/log.js";
import { Context } from "../../context.js";
import { Action, ActionProperties } from "../action.js";
import { capitalise } from "../../../util/string.js";

/**
 * Check or uncheck a checkbox or a radio button.
 */
export class CheckAction extends Action {

    /** The selector to use when resolving the DOM element */
    readonly selector: string;

    /** The state to set */
    readonly state: "check" | "uncheck";

    constructor(description: string | undefined, props: ActionProperties) {
        super(description);
        this.selector = Array.isArray(props) ? props[0] : props.selector;
        this.state = Array.isArray(props) && props.length > 1 ? props[1] : (props.state ?? "check");
    }

    async run(ctx: Context) {
        log.info("%s '%s'", capitalise(this.state), this.selector);
        await ctx.page().locator(this.selector).first()
            .setChecked(this.state == "check");
    }

}
