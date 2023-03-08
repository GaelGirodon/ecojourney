import log from "../../../util/log.js";
import { Context } from "../../context.js";
import { Action, ActionProperties } from "../action.js";

/**
 * Scroll an element into view.
 */
export class ScrollAction extends Action {

    /** The selector to use when resolving the DOM element */
    readonly selector: string;

    constructor(props: ActionProperties) {
        super();
        this.selector = Array.isArray(props) ? props[0] : props.selector;
    }

    async run(ctx: Context) {
        log.info("Scroll '%s' into view", this.selector);
        await ctx.page().locator(this.selector).first()
            .scrollIntoViewIfNeeded();
    }

}
