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
    const procedures = manifest.procedures ?? {};
    const actions = (manifest.actions || []).flatMap(spec => {
        const a = createAction(spec);
        if (!(a instanceof ProcedureAction)) return [a];
        if (!(a.name in procedures))
            throw new Error(`Procedure '${a.name}' is not defined`);
        return procedures[a.name].map((nSpec, i) => {
            const na = createAction(nSpec);
            if (na instanceof ProcedureAction)
                throw new Error(`Procedure nesting is not allowed, action #${i
                    } in procedure '${a.name}' can't call '${na.name}'`);
            na.args = a.args;
            return na;
        });
    });
    log.debug("Actions loaded: %d actions", actions.length);

    //
    // Explicit implicit actions
    //

    // Add a first navigation action if missing (implicit)
    // to avoid running actions on an empty new tab/page
    const firstActionIndex = actions.findIndex(a => !(a instanceof ScenarioAction));
    if (firstActionIndex < 0 || !(actions[firstActionIndex] instanceof GotoAction)) {
        actions.splice(Math.max(firstActionIndex, 0), 0,
            new GotoAction({ url: manifest.url }));
    }

    // Add a first scenario if omitted (implicit) in the manifest file
    if (!(actions[0] instanceof ScenarioAction)) {
        actions.unshift(new ScenarioAction({ name: manifest.name }));
    }

    // Add a page analysis at the end if none was provided
    // (the user wants implicitly to analyse a single page)
    if (!actions.some(a => a instanceof PageAction)) {
        actions.push(new PageAction({ name: manifest.name }));
    }

    log.debug("Actions enhanced: %d actions", actions.length);

    return new ActionIterator(actions);
}

/**
 * Built-in actions
 */
const factories: { [key: string]: { new(props: ActionProperties): Action } } = {
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
 * @param spec Action definition loaded from the manifest file
 * @returns The action
 */
function createAction(spec: ActionSpec): Action {
    const id = Object.keys(spec)[0];
    const value = spec[id] as (string | { [key: string]: string });
    const props = typeof value === "string" ? value.split(/, */g) : value;
    return new factories[id](props);
}
