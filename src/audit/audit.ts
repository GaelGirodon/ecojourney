import log from "../util/log.js";
import { Analyser } from "./analysis/analyser.js";
import { aggregateResults, PageResult } from "./analysis/result.js";
import { PageAction } from "./browsing/actions/page.js";
import { createActions } from "./browsing/factory.js";
import { ActionIterator } from "./browsing/iterator.js";
import { PageArtifact } from "./collection/artifact.js";
import { ArtifactCollector } from "./collection/collector.js";
import { Config, loadConfig } from "./config.js";
import { Context } from "./context.js";
import { loadManifest } from "./manifest/load.js";
import { Manifest } from "./manifest/manifest.js";
import { ReportData } from "./report/model.js";
import { report } from "./report/report.js";

/**
 * Website eco-design compliance audit
 */
export class Audit {

    private manifest!: Manifest;
    private config!: Config;
    private actions!: ActionIterator;
    private analyser!: Analyser;
    private ctx!: Context;
    private collector!: ArtifactCollector;
    private results!: PageResult[];

    constructor(
        /** Path to the audit manifest file or website page URL */
        private readonly path: string,
        /** CLI options */
        private readonly opts: Config
    ) { }

    /**
     * Audit a website eco-design compliance.
     */
    async run() {
        await this.prepare();
        for (let r = 0, done = false; !this.config.dryRun && r <= this.config.retries && !done; r++) {
            try {
                await this.audit();
                done = true;
            } catch (cause) {
                if (r >= this.config.retries) throw new Error("Audit failed", { cause });
                log.error("Audit failed, retrying (%i/%i): %s", r + 1, this.config.retries,
                    log.formatError(cause));
            }
        }
        await this.report();
    }

    /**
     * Load the manifest, actions and prepare the analysis.
     */
    private async prepare() {
        this.manifest = await loadManifest(this.path);
        this.config = await loadConfig(this.opts, this.manifest.config ?? {});
        this.actions = createActions(this.manifest);

        this.analyser = await Analyser.init();
        this.ctx = new Context(this.config, this.actions.actions);
        this.collector = new ArtifactCollector();
        this.ctx.onNewPage(async page => this.collector.bind(page));
    }

    /**
     * Audit the website.
     */
    private async audit() {
        try {
            // Launch the browser
            await this.ctx.launchBrowser();
            await this.ctx.newPage();
            let startTime = new Date();

            // Run actions and analyse
            const results: PageResult[] = [];
            while (this.actions.hasNext()) {
                this.collector.enable = !this.ctx.scenario.exclude;
                const { action, output } = await this.actions.runNext(this.ctx);
                // Wait for collector asynchronous tasks to resolve before continuing
                await this.collector.asyncTasks();
                if (action instanceof PageAction && !this.ctx.scenario.exclude) {
                    // Analyse the current page with collected requests & responses
                    const page: PageArtifact = {
                        ...this.collector.dump(), startTime,
                        index: this.ctx.actionIndex(action, true),
                        name: output?.name ?? action.name,
                        frame: this.ctx.page().mainFrame()
                    };
                    results.push(await this.analyser.analyse(page, this.ctx.scenario));
                    startTime = new Date();
                }
            }
            this.results = results;
        } finally {
            await this.ctx.closeBrowser();
        }
    }

    /**
     * Write audit results to reports.
     */
    private async report() {
        const result: ReportData = {
            manifest: this.manifest,
            config: this.config,
            metrics: this.analyser.metrics,
            rules: this.analyser.rules,
            result: aggregateResults(this.results)
        };
        await report(result);
    }
}
