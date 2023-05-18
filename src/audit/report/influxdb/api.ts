import { promisify } from "node:util";
import { gzip as nodeGzip } from "node:zlib";
import { request } from "../../../util/http.js";
import log from "../../../util/log.js";
import { escapeChars as esc } from "../../../util/string.js";
import { Measure } from "../../analysis/measure.js";
import { AggregatedResult, PageResult, ScenarioResult } from "../../analysis/result.js";
import { Config } from "../../config.js";
import { InfluxDBConfig } from "./config.js";

const gzip = promisify(nodeGzip);

/**
 * A basic client for the InfluxDB write API using the line protocol
 */
export class InfluxDB {

    constructor(
        /** InfluxDB API connection configuration */
        private config: InfluxDBConfig
    ) { }

    /**
     * Write points by issuing a POST request to the InfluxDB API.
     * @param points Points to write using the line protocol
     */
    async write(points: Point[]) {
        const url = `${this.config.url.replace(/\/+$/, "")
            }/api/v2/write?org=${this.config.org
            }&bucket=${this.config.bucket}&precision=ms`;
        log.debug("Write %d points to InfluxDB using API: POST %s", points.length, url);
        const body = points.map(p => p.toLine()).join("\n");
        const compressedBody = await gzip(body);
        const res = await request(url, {
            method: "POST",
            headers: {
                "Authorization": `Token ${this.config.token}`,
                "Content-Encoding": "gzip",
                "Content-Type": "text/plain; charset=utf-8",
                "Accept": "application/json"
            },
            body: compressedBody
        });
        log.debug("InfluxDB API response received with status %d", res.status);
        if (res.status >= 400) {
            throw new Error("Unable to write points to InfluxDB", {
                cause: res ? await res.json() : undefined
            });
        }
    }

}

/**
 * Point defines values of a single measurement.
 */
export class Point {

    constructor(
        /** The measurement name */
        readonly measurementName: string,
        /** Tag key-value pairs for the point */
        readonly tags: Record<string, string> = {},
        /** Field key-value pairs for the point */
        readonly fields: Record<string, string> = {},
        /** The Unix timestamp */
        private _timestamp = new Date()
    ) {
        this.measurementName = esc(measurementName, " ,");
    }

    /*
     * Low-level setters
     */

    /**
     * Set a tag key-value pair.
     * @param key The key
     * @param value The value
     * @returns this
     */
    tag(key: string, value: string) {
        this.tags[esc(key, ",= ")] = esc(value, ",= ");
        return this;
    }

    /**
     * Set a 64-bit floating-point number field.
     * @param key The key
     * @param value The value
     * @returns this
     */
    floatField(key: string, value: number) {
        this.fields[esc(key, ",= ")] = `${value}`;
        return this;
    }

    /**
     * Set a signed or unsigned 64-bit integer field.
     * @param key The key
     * @param value The value
     * @param sign Signed ("i") or unsigned integer ("u")
     * @returns this
     */
    intField(key: string, value: number, sign: "u" | "i" = "i") {
        this.fields[esc(key, ",= ")] = `${Math.trunc(value)}${sign}`;
        return this;
    }

    /**
     * Set a plain text string field.
     * @param key The key
     * @param value The value
     * @returns this
     */
    stringField(key: string, value: string) {
        this.fields[esc(key, ",= ")] = `"${esc(value, "\"\\\\")}"`;
        return this;
    }

    /**
     * Set the Unix timestamp.
     * @param value The Unix timestamp
     * @returns this
     */
    timestamp(timestamp: Date) {
        this._timestamp = timestamp;
        return this;
    }

    /*
     * High-level setters
     */

    /**
     * Set measurement scope.
     * @param s Point scope
     * @returns this
     */
    scope(s: "audit" | "scenario" | "page") {
        this.tag("scope", s);
        return this;
    }

    /**
     * Write configuration tags.
     * @param c Configuration
     * @returns this
     */
    config(c: Config) {
        this.tag("browser", c.browser);
        return this;
    }

    /**
     * Write scenario tags.
     * @param s Scenario result
     * @returns this
     */
    scenario(s: ScenarioResult) {
        this.tag("scenario_id", s.id)
            .tag("scenario_name", s.name)
            .tag("scenario_index", `${s.index}`);
        return this;
    }

    /**
     * Write page tags.
     * @param p Page result
     * @returns this
     */
    page(p: PageResult) {
        this.tag("page_id", p.id)
            .tag("page_name", p.name)
            .tag("page_url", p.url)
            .tag("page_title", p.title)
            .tag("page_index", `${p.index}`);
        return this;
    }

    /**
     * Write analysis statistics fields.
     * @param r Analysis result
     * @returns this
     */
    stats(r: AggregatedResult) {
        this.intField("duration", r.endTime.getTime() - r.startTime.getTime(), "u");
        for (const [severity, count] of Object.entries(r.stats)) {
            this.intField(severity, count, "u");
        }
        return this;
    }

    /**
     * Write measure tags and fields.
     * @param m Measure
     * @returns this
     */
    measure(m: Measure) {
        this.tag("metric_id", m.metric.id)
            .tag("metric_name", m.metric.name)
            .floatField("value", m.data.value)
            .stringField("value_display", m.value);
        if (m.hasGrade) {
            this.intField("grade", m.grade!, "u")
                .stringField("grade_letter", m.gradeLetter!);
        }
        return this;
    }

    /*
     * Serialisation
     */

    /**
     * Serialise the point to a line for the line protocol.
     * @returns The line
     */
    toLine(): string {
        const tags = Object.entries(this.tags).map(([k, v]) => `${k}=${v}`).join(",");
        const fields = Object.entries(this.fields).map(([k, v]) => `${k}=${v}`).join(",");
        return `${this.measurementName},${tags} ${fields} ${this._timestamp.getTime()}`;
    }

}
