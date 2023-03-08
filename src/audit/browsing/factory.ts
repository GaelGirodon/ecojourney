import log from "../../util/log.js";
import { Manifest } from "../manifest/manifest.js";
import { Action, ActionProperties } from "./action.js";
import { CheckAction } from "./actions/check.js";
import { ClickAction } from "./actions/click.js";
import { FillAction } from "./actions/fill.js";
import { GotoAction } from "./actions/goto.js";
import { PageAction } from "./actions/page.js";
import { ProcedureAction } from "./actions/procedure.js";
import { ScenarioAction } from "./actions/scenario.js";
import { ScreenshotAction } from "./actions/screenshot.js";
import { ScrollAction } from "./actions/scroll.js";
import { SelectAction } from "./actions/select.js";
import { UploadAction } from "./actions/upload.js";
import { WaitAction } from "./actions/wait.js";
import { ActionIterator } from "./iterator.js";
import { ActionSpec } from "./spec.js";

/**
 * Create and normalise actions from specifications.
 * @param manifest Audit manifest with actions specifications
 * @returns Actions ready to be executed
 */
export function createActions(manifest: Manifest) {

    //
    // Create actions from specifications
    //

    log.debug("Load actions");
    const actions = (manifest.actions || []).map(a => createAction(a));
    log.debug("Actions loaded: %d actions", actions.length);

    //
    // Explicit implicit actions
    //

    // Add a first navigation action if missing (implicit)
    // to avoid running actions on an empty new tab/page
    const firstActionIndex = actions.findIndex(a => !(a instanceof ScenarioAction));
    if (firstActionIndex < 0 || !(actions[firstActionIndex] instanceof GotoAction)) {
        actions.splice(Math.max(firstActionIndex, 0), 0,
            new GotoAction(undefined, { url: manifest.url }));
        // TODO Check procedures
    }

    // Add a first scenario if omitted (implicit) in the manifest file
    if (!(actions[0] instanceof ScenarioAction)) {
        actions.unshift(new ScenarioAction(undefined,
            { name: manifest.name ?? manifest.url }));
    }

    // Add a page analysis at the end if none was provided
    // (the user wants implicitly to analyse a single page)
    if (!actions.some(a => a instanceof PageAction)) {
        actions.push(new PageAction(undefined,
            { name: manifest.name ?? manifest.url }));
    }

    log.debug("Actions enhanced: %d actions", actions.length);

    //
    // Parse and check procedures
    //
    // TODO Inline procedures ?
    //

    log.debug("Load procedures");
    const procedures: { [name: string]: Action[] } = {};
    if (manifest.procedures) {
        for (const [proc, actions] of Object.entries(manifest.procedures)) {
            procedures[proc] = actions.map(a => createAction(a));
        }
    }
    for (const a of actions) {
        if (a instanceof ProcedureAction && !procedures[a.name]) {
            throw new Error(`Procedure '${a.name}' is not defined`);
        }
    }
    log.debug("Procedures loaded: %d procedures", Object.values(procedures).length);

    return new ActionIterator(actions, procedures);
}

/**
 * Built-in actions
 */
const factories: {
    [key: string]: {
        new(description: string | undefined, props: ActionProperties): Action
    }
} = {
    "check": CheckAction,
    "click": ClickAction,
    "fill": FillAction,
    "goto": GotoAction,
    "page": PageAction,
    "procedure": ProcedureAction,
    "scenario": ScenarioAction,
    "screenshot": ScreenshotAction,
    "scroll": ScrollAction,
    "select": SelectAction,
    "upload": UploadAction,
    "wait": WaitAction
};

/**
 * Create an action from its definition.
 * @param a Action definition loaded from the manifest file
 * @returns The action
 */
function createAction(a: ActionSpec): Action {
    const id = Object.keys(a).filter(k => k !== "name")[0];
    const value = a[id] as (string | { [key: string]: string });
    const props = typeof value === "string" ? value.split(/, */g) : value;
    return new factories[id]!(a.name, props);
}
