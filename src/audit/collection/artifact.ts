import { Frame, Request, Response } from "playwright-core";

/**
 * A page to analyse.
 */
export interface PageArtifact {

    /** Page index */
    readonly index: number;

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
