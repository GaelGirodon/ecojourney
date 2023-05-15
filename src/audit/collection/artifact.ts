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

    /** Collected failed requests */
    readonly failedRequests: RequestArtifact[];

    /** Collected page errors */
    readonly errors: Error[];

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

    /** Exchange has been loaded from the browser cache */
    readonly servedFromCache: boolean;

}
