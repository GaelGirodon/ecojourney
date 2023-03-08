import log from "../../../util/log.js";
import { Scenario } from "../../collection/artifact.js";
import { Context } from "../../context.js";
import { Action, ActionProperties } from "../action.js";

/**
 * Start a scenario (allows to group page audit results).
 */
export class ScenarioAction extends Action {

    /** The scenario name */
    readonly name: string;

    /** Close the current context and create a new one */
    readonly newContext: boolean = false;

    /** Exclude this scenario from analysis */
    readonly exclude: boolean = false;

    constructor(props: ActionProperties) {
        super();
        this.name = Array.isArray(props) ? props[0] : props.name;
        if (!Array.isArray(props)) {
            const newContext = props.newContext as string | boolean;
            this.newContext = newContext === true || newContext === "true";
            const exclude = props.exclude as string | boolean;
            this.exclude = exclude === true || exclude === "true";
        }
    }

    async run(ctx: Context) {
        log.info("Start scenario '%s'", this.name);
        ctx.scenario = new Scenario(this.name, this.exclude);
        if (this.newContext) {
            await ctx.newPage(true);
        }
    }

}
