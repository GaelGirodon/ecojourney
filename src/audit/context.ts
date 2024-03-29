import process from "node:process";
import playwright, { Browser, BrowserContext, BrowserContextOptions, devices, LaunchOptions, Page } from "playwright-core";
import log from "../util/log.js";
import { Scenario } from "./analysis/result.js";
import { Action, ActionArguments } from "./browsing/action.js";
import { Config } from "./config.js";

/**
 * Browsing and analysis context
 */
export class Context {

    /** Unique identifier for the current run */
    readonly runId: number;

    /** Date/time at which the audit was started */
    readonly startedAt: Date;

    /** Current scenario */
    scenario: Scenario;

    /** Browser */
    private browser?: Browser;

    /** Browser context */
    private browserContext?: BrowserContext;

    /** Browser page */
    private _page?: Page;

    /** Handler called when a new page is created */
    newPageHandler?: (page: Page) => Promise<void>;

    constructor(
        /** Audit configuration */
        readonly config: Config,
        /** Browsing actions */
        private readonly actions: Action[]
    ) {
        this.startedAt = new Date();
        this.runId = this.startedAt.getTime();
        this.scenario = new Scenario();
    }

    /*
     * Getters & mutators
     */

    /**
     * Get data that can be injected in action properties.
     * @param args Action arguments from the parent procedure
     * @returns The template data
     */
    public data(args: ActionArguments = {}) {
        return { env: process.env, args };
    }

    /**
     * Get the index of the given action.
     * @param action The action for which to get the index
     * @param sameType Get the index within actions with the same type
     * @returns The action index (from 0)
     */
    public actionIndex(action: Action, sameType = false) {
        return this.actions
            .filter(a => !sameType || a.constructor.name === action.constructor.name)
            .indexOf(action);
    }

    /*
     * Browser
     */

    /**
     * Launch a new browser instance.
     */
    async launchBrowser() {
        if (this.browserContext) await this.browserContext.close();
        if (this.browser) await this.browser.close();
        log.debug("Launch browser");

        // Choose the right browser and channel
        const launchOptions: LaunchOptions = {
            headless: this.config.headless,
            slowMo: this.config.headless ? 0 : 500
        };
        let browserType = this.config.browser;
        if (browserType === "msedge" || browserType === "chrome") {
            launchOptions.channel = browserType;
            browserType = "chromium";
        } else if (browserType === "chromium" && !process.env.PLAYWRIGHT_BROWSERS_PATH) {
            launchOptions.channel = "chrome";
        }

        // Configure the proxy
        if (this.config.proxy?.server) {
            launchOptions.proxy = this.config.proxy;
        }

        this.browser = await playwright[browserType].launch(launchOptions);
    }

    /**
     * Create a new page in the browser context and close the previous one.
     * @param newContext Create a new context before creating the page
     */
    async newPage(newContext = false) {
        if (!this.browser) {
            throw new Error("Browser must be launched first");
        }
        if (this._page) {
            log.debug("Close browser page");
            await this._page.close();
            this._page = undefined;
        }
        if (this.browserContext && newContext) {
            log.debug("Close browser context");
            await this.browserContext.close();
            this.browserContext = undefined;
        }
        if (this.browserContext === undefined) {
            log.debug("New browser context");
            const options: BrowserContextOptions | undefined = {};
            if (this.config.device) {
                Object.assign(options, devices[this.config.device]);
            }
            if (this.config.headers) {
                options.extraHTTPHeaders = this.config.headers;
            }
            this.browserContext = await this.browser.newContext(options);
            if (this.config.timeout) {
                this.browserContext.setDefaultTimeout(this.config.timeout);
            }
        }
        log.debug("New browser page");
        this._page = await this.browserContext.newPage();
        if (this.newPageHandler) {
            await this.newPageHandler(this._page);
        }
    }

    /**
     * The current browser page
     */
    public page(): Page {
        return this._page!;
    }

    /**
     * Run the given handler when a new page is created.
     * @param handler New page event handler
     */
    onNewPage(handler: (page: Page) => Promise<void>) {
        this.newPageHandler = handler;
    }

    /**
     * Close the browser, the context and the page.
     */
    async closeBrowser() {
        log.debug("Close browser");
        if (this._page) await this._page.close();
        if (this.browserContext) await this.browserContext.close();
        if (this.browser) await this.browser.close();
    }

}
