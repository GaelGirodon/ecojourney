import * as units from "../../util/units.js";
import { Metric, MetricId } from "./analysers/spec.js";

/**
 * A measure
 */
export class Measure {

    /** Time at which the measure was taken */
    readonly time: Date;

    constructor(
        /** Metric definition */
        readonly metric: Metric,
        /** Measure data */
        public data: MeasureData = { value: 0 }
    ) {
        this.time = new Date();
    }

    /**
     * Measure value to display (with unit)
     */
    public get value(): string {
        if (this.metric.unit === "byte")
            return units.bytes(this.data.value);
        if (this.metric.unit === "second")
            return units.seconds(this.data.value);
        if (this.metric.unit === "integer")
            return `${units.round(this.data.value, 0)}`;
        if (this.metric.unit)
            return `${units.round(this.data.value, 2)} ${this.metric.unit}`;
        return `${units.round(this.data.value, 2)}`;
    }

    /**
     * Measure has a grade
     */
    public get hasGrade(): boolean {
        return this.metric.grade !== undefined;
    }

    /**
     * Measure grade number
     */
    public get grade(): MeasureGrade | undefined {
        if (!this.metric.grade?.length) {
            return undefined
        }
        let i = 0;
        const grades = this.metric.grade;
        for (; this.data.value < grades[i] && i < MeasureGrade.G && i < grades.length; i++) { }
        return i;
    }

    /**
     * Measure grade letter (lowercase)
     */
    public get gradeLetter(): string | undefined {
        const grade = this.grade;
        return grade === undefined ? undefined
            : ["a", "b", "c", "d", "e", "f", "g"][grade];
    }

    /**
     * Add a measure value to the current aggregated measure value
     * using the adequate aggregation function.
     * @param measure The measure to add
     * @param count Total number of measures in the final aggregated value
     * @returns this
     */
    add(measure: Measure, count?: number) {
        if (this.metric.aggregation === "sum") {
            this.data.value += measure.data.value;
        } else if (this.metric.aggregation === "avg" && count && count > 0) {
            this.data.value += measure.data.value / count;
        } else {
            throw new Error("Invalid aggregation");
        }
        return this;
    }

    /**
     * @returns The object to serialize as JSON
     */
    public toJSON() {
        const output: { [key: string]: any } = {
            id: this.metric.id,
            time: this.time,
            value: this.data.value,
            valueDisplay: this.value
        };
        if (this.hasGrade) {
            output.grade = this.grade;
            output.gradeLetter = this.gradeLetter;
        }
        return output;
    }

    /**
     * Determine whether the 'a' measure has a higher, equal or lower
     * priority 'b' the other measure.
     * @param b Measure to compare with the 'a' measure
     * @returns 'a' is before (<0) / equal to (0) / after (>0) 'b'
     */
    static compare(a: Measure, b: Measure): number {
        const order = a.metric.order - b.metric.order;
        return order !== 0 ? order : a.metric.id.localeCompare(b.metric.id);
    }

}

/**
 * Measure grade from A (best) to worst (G)
 */
export enum MeasureGrade { A = 0, B, C, D, E, F, G }

/**
 * A measure data returned by a page analyser
 */
export interface MeasureData {

    /** Measure value */
    value: number;

}

/**
 * Aggregate given measures to the given map.
 * @param measures Measures to aggregate
 * @returns Aggregated measures
 */
export function aggregateMeasures(measures: Measure[]): Measure[] {
    const measuresById = measures.reduce((map, measure) => {
        map.set(measure.metric.id, [...(map.get(measure.metric.id) || []), measure]);
        return map;
    }, new Map<MetricId, Measure[]>());
    const aggregateMeasures = [];
    for (const measures of measuresById.values()) {
        aggregateMeasures.push(measures
            .reduce((agg, val) => agg.add(val, measures.length),
                new Measure(measures[0].metric)));
    }
    return aggregateMeasures;
}
