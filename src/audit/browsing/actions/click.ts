import log from "../../../util/log.js";
import { Context } from "../../context.js";
import { Action, ActionProperties } from "../action.js";

/**
 * Click on an element.
 */
export class ClickAction extends Action {

    /** The selector to use when resolving the DOM element */
    readonly selector: string

    constructor(props: ActionProperties) {
        super();
        this.selector = Array.isArray(props) ? props[0] : props.selector;
    }

    async run(ctx: Context) {
        log.info("Click on '%s'", this.selector);
        await ctx.page().locator(this.selector).click();
    }

}
