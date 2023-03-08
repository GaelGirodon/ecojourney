import { resolve } from "node:path";
import log from "../../../util/log.js";
import { Context } from "../../context.js";
import { Action, ActionProperties } from "../action.js";

/**
 * Take a screenshot of the current page.
 */
export class ScreenshotAction extends Action {

    /** The file path to save the image to */
    readonly path: string;

    constructor(props: ActionProperties) {
        super();
        this.path = Array.isArray(props) ? props[0] : props.path;
    }

    async run(ctx: Context) {
        const path = resolve(ctx.config.output, this.path);
        log.info("Take a screenshot and save it to '%s'", path);
        await ctx.page().screenshot({ path });
        return { path };
    }

}
