import log from "../../../util/log.js";
import { Context } from "../../context.js";
import { Action, ActionProperties } from "../action.js";

/**
 * Wait for the required load state to be reached
 * or for an element to be visible.
 */
export class WaitAction extends Action {

    /** Available load states */
    static states: string[] = ["load", "domcontentloaded", "networkidle"];

    /** The load state to wait for */
    readonly state?: "load" | "domcontentloaded" | "networkidle";

    /** The selector to use when resolving the DOM element */
    readonly selector: string = "";

    constructor(props: ActionProperties) {
        super();
        if (Array.isArray(props) && WaitAction.states.includes(props[0]) || props.state) {
            this.state = Array.isArray(props) ? props[0] : props.state;
        } else {
            this.selector = Array.isArray(props) ? props[0] : props.selector;
        }
    }

    async run(ctx: Context) {
        if (this.state) {
            log.info("Wait for load state '%s'", this.state);
            return await ctx.page().waitForLoadState(this.state);
        } // else
        log.info("Wait for '%s' to be visible", this.selector);
        await ctx.page().locator(this.selector).first().waitFor();
    }

}
