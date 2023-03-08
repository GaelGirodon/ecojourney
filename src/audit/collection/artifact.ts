import { randomUUID } from "crypto";
import { Frame, Request, Response } from "playwright-core";
import { omit } from "../../util/object.js";

/**
 * A browsing scenario.
 */
export class Scenario {

    /** The scenario unique identifier */
    readonly id: string;

    constructor(
        /** The scenario name */
        readonly name: string = "",
        /** Exclude this scenario from analysis */
        readonly exclude: boolean = false
    ) {
        this.id = randomUUID(); // TODO Compute stable checksum from name and index
    }

    /**
     * @returns The object to serialize as JSON
     */
    public toJSON() {
        return omit(this, ["exclude"]);
    }

}

/**
 * A page to analyse.
 */
export interface PageArtifact {

    /** Page name */
    readonly name: string;

    /** Collected requests */
    readonly requests: RequestArtifact[];

    /** Collected responses */
    readonly responses: ResponseArtifact[];

    /** Page frame */
    readonly frame: Frame;

}

/**
 * An HTTP page request to analyse.
 */
export interface RequestArtifact {

    /** Browser request */
    readonly request: Request;

}

/**
 * An HTTP page response to analyse.
 */
export interface ResponseArtifact {

    /** Browser response */
    readonly response: Response;

    /** Browser response body */
    readonly body: Buffer | null;

    /** Browser response body length */
    readonly bodyLength: number;

}
