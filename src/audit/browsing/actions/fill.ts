import log from "../../../util/log.js";
import { Context } from "../../context.js";
import { Action, ActionProperties } from "../action.js";
import { render } from "../template.js";

/**
 * Fill an input or a textarea with a text.
 */
export class FillAction extends Action {

    /** The selector to use when resolving the DOM element */
    readonly selector: string;

    /** The value to set (supports templating) */
    readonly value: string;

    constructor(description: string | undefined, props: ActionProperties) {
        super(description);
        this.selector = Array.isArray(props) ? props[0] : props.selector;
        this.value = Array.isArray(props) ? props[1] : props.value;
    }

    async run(ctx: Context) {
        log.info("Fill '%s' with '%s'", this.selector, this.value);
        const value = render(this.value, ctx.templateData());
        await ctx.page().locator(this.selector).first().fill(value);
        return { value };
    }

}
