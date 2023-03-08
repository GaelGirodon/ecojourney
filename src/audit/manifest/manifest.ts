import { ActionSpec } from "../browsing/spec.js";
import { Config } from "../config.js";

/**
 * An audit manifest file containing metadata,
 * configuration and browsing actions.
 */
export interface Manifest {

    /** Name of the web application */
    name?: string;

    /** Description of the web application or of the current test */
    description?: string;

    /** Main/root URL of the web application */
    url: string;

    /** Audit configuration */
    config: Config;

    /** Reusable sequences of actions */
    procedures?: { [key: string]: ActionSpec[] };

    /** Browsing actions to simulate */
    actions?: ActionSpec[];

    /** Time at which the manifest was loaded */
    time: Date;

}
