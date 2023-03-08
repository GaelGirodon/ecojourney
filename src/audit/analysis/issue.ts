import { Rule, RuleId } from "./analysers/spec.js";

/**
 * A bad practice that needs to be fixed
 */
export class Issue {

    /** Time at which the issue was reported */
    readonly time: Date;

    constructor(
        /** Issue rule metadata */
        readonly rule: Rule,
        /** Issue data */
        public data: IssueData
    ) {
        this.time = new Date();
    }

    /**
     * @returns The object to serialize as JSON
     */
    public toJSON() {
        return { ...this.rule, ...this.data };
    }

}

/**
 * A bad practice that needs to be fixed,
 * returned by a page analyser.
 */
export interface IssueData {

    /** Issue rule unique identifier */
    readonly id: RuleId;

    /** Element affected by the issue */
    readonly element: string;

    /** Issue severity */
    readonly severity: IssueSeverity;

    /** Issue occurrences count */
    readonly occurrences: number;

}

/**
 * Issue severity level
 */
export enum IssueSeverity {

    /**
     * A finding worth mentioning but not serious
     */
    Info = "info",

    /**
     * An issue that have a minor responsibility in the environmental
     * impact of the application, it should be fixed.
     */
    Minor = "minor",

    /**
     * An issue that have a major responsibility in the environmental
     * impact of the application, it should be promptly fixed.
     */
    Major = "major",

    /**
     * An issue that have a massive responsibility in the environmental
     * impact of the application, fixing it will hugely reduce the impact.
     */
    Critical = "critical"

}

/**
 * Issue severity level builder
 */
export class IssueSeverityBuilder {

    /**
     * Compute the issue severity level from thresholds.
     * @param value Value from which to compute the severity
     * @param thresholds Values from which the severity will be {@link IssueSeverity.Minor},
     *                   {@link IssueSeverity.Major} and {@link IssueSeverity.Critical}
     * @returns The issue severity
     */
    static fromThresholds(value: number, ...thresholds: number[]): IssueSeverity {
        if (thresholds.length < 1 || value < thresholds[0])
            return IssueSeverity.Info;
        if (thresholds.length < 2 || value < thresholds[1])
            return IssueSeverity.Minor;
        if (thresholds.length < 3 || value < thresholds[2])
            return IssueSeverity.Major;
        return IssueSeverity.Critical;
    }
}
