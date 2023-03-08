import log from "../../../util/log.js";
import { Context } from "../../context.js";
import { Action, ActionProperties } from "../action.js";

/**
 * Select input files for upload.
 */
export class UploadAction extends Action {

    /** The selector to use when resolving the DOM element */
    readonly selector: string;

    /** Input files to set */
    readonly files: string[];

    constructor(description: string | undefined, props: ActionProperties) {
        super(description);
        this.selector = Array.isArray(props) ? props[0] : props.selector;
        this.files = Array.isArray(props) ? props.slice(1)
            : (props.files ? props.files : [props.file]);
    }

    async run(ctx: Context) {
        log.info("Set files %o for input '%s'", this.files, this.selector);
        await ctx.page().locator(this.selector).first()
            .setInputFiles(this.files);
    }

}
