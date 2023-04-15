import playwright from "playwright-core";
import log from "../../util/log.js";
import * as units from "../../util/units.js";
import { RequestArtifact, ResponseArtifact } from "./artifact.js";

/**
 * Collect artifacts (to be analysed) using browser events.
 */
export class ArtifactCollector {

    /** Collected requests */
    private requests: RequestArtifact[] = [];

    /** Collected responses */
    private responses: ResponseArtifact[] = [];

    /** Asynchronous tasks launched in event handlers */
    private _asyncTasks: Promise<any>[] = [];

    /** Collect artifacts when true */
    enable = true;

    /**
     * Register event handlers on the given page
     * to collect requests and responses.
     * @param page The browser page
     */
    bind(page: playwright.Page) {
        page.on("request", request => this.collectRequest(request));
        page.on("response", response => this.collectResponse(response));
    }

    /**
     * Collect a browser request.
     * @param request The browser request to collect
     */
    private collectRequest(request: playwright.Request) {
        if (!(this.enable && request.url().startsWith("http"))) {
            return;
        }
        log.debug("Collect request: %s %s", request.method(), request.url());
        this.requests.push({ request });
    }

    /**
     * Collect a browser response.
     * @param response The browser response to collect
     */
    private async collectResponse(response: playwright.Response) {
        if (!(this.enable && response.url().startsWith("http"))) {
            return;
        }
        const asyncBody = response.body().catch(() => null);
        this._asyncTasks.push(asyncBody);
        const body = await asyncBody;
        const asyncSizes = response.request().sizes()
            .catch(() => ({ responseBodySize: -1 }));
        this._asyncTasks.push(asyncSizes);
        const sizes = await asyncSizes;
        const contentLength = parseInt(response.headers()["content-length"]);
        const bodyLength = [sizes?.responseBodySize, contentLength, body?.byteLength]
            .find(len => len && len > 0) ?? 0;
        const servedFromCache = response.request().timing().requestStart < 0;
        log.debug("Collect response: %s => %d %s (%s)%s", response.url(),
            response.status(), response.statusText(), units.bytes(bodyLength),
            servedFromCache ? " [cache]" : "");
        this.responses.push({ response, body, bodyLength, servedFromCache });
    }

    /**
     * Wait for asynchronous tasks to resolve: this is mandatory before
     * navigating otherwise some resources could no longer be available.
     */
    async asyncTasks(): Promise<void> {
        await Promise.all(this._asyncTasks);
        this._asyncTasks = [];
    }

    /**
     * Get the collected artifacts and reset the collector.
     * @returns Collected artifacts
     */
    dump() {
        log.debug("Dump collected artifacts: %d requests, %d responses",
            this.requests.length, this.responses.length);
        const result = {
            requests: this.requests,
            responses: this.responses
        };
        this.requests = [];
        this.responses = [];
        return result;
    }

}
