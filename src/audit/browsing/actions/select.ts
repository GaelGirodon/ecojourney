import log from "../../../util/log.js";
import { Context } from "../../context.js";
import { Action, ActionProperties } from "../action.js";

/**
 * Select option or options in select.
 */
export class SelectAction extends Action {

    /** The selector to use when resolving the DOM element */
    readonly selector: string;

    /** Option(s) to select */
    readonly values: string[];

    constructor(description: string | undefined, props: ActionProperties) {
        super(description);
        this.selector = Array.isArray(props) ? props[0] : props.selector;
        this.values = Array.isArray(props) ? props.slice(1)
            : (props.values ? props.values : [props.value]);
    }

    async run(ctx: Context) {
        log.info("Select %j in select '%s'", this.values, this.selector);
        await ctx.page().locator(this.selector).first()
            .selectOption(this.values);
    }

}
