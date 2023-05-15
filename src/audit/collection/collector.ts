import playwright from "playwright-core";
import log from "../../util/log.js";
import { pick } from "../../util/object.js";
import * as units from "../../util/units.js";
import { RequestArtifact, ResponseArtifact } from "./artifact.js";

/**
 * Collect artifacts (to be analysed) using browser events.
 */
export class ArtifactCollector {

    /** Collected requests */
    requests: RequestArtifact[] = [];

    /** Collected responses */
    responses: ResponseArtifact[] = [];

    /** Collected failed requests */
    failedRequests: RequestArtifact[] = [];

    /** Collected page errors */
    errors: Error[] = [];

    /** Asynchronous tasks launched in event handlers */
    _asyncTasks: Promise<any>[] = [];

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
        page.on("requestfailed", request => this.collectFailedRequest(request));
        page.on("pageerror", error => this.collectError(error));
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
        log.debug("Collect response: %s %s => %d %s (%s)%s",
            response.request().method(), response.url(), response.status(),
            response.statusText(), units.bytes(bodyLength),
            servedFromCache ? " [cache]" : "");
        this.responses.push({ response, body, bodyLength, servedFromCache });
    }

    /**
     * Collect a browser failed request.
     * @param request The browser failed request to collect
     */
    private collectFailedRequest(request: playwright.Request) {
        if (!this.enable) {
            return;
        }
        log.debug("Collect failed request: %s %s => %s", request.method(),
            request.url(), request.failure()?.errorText);
        this.failedRequests.push({ request });
    }

    /**
     * Collect a page error.
     * @param error The page error to collect
     */
    private collectError(error: Error): void {
        if (!this.enable) {
            return;
        }
        log.debug("Collect page error: %s", log.formatError(error));
        this.errors.push(error);
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
        const result = pick(this, ["requests", "responses", "failedRequests", "errors"]);
        log.debug("Dump collected artifacts: %s", Object.entries(result)
            .map(([k, v]) => `${v.length} ${k}`).join(", "));
        this.requests = [];
        this.responses = [];
        this.failedRequests = [];
        this.errors = [];
        return result;
    }

}
