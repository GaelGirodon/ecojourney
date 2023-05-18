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
        this.data = Object.assign({
            occurrences: 1
        }, data);
        this.time = new Date();
    }

    /**
     * @returns The object to serialize as JSON
     */
    toJSON() {
        return { ...this.rule, ...this.data };
    }

    /**
     * Determine whether the 'a' issue is before, equal or after
     * the 'b' issue.
     * @param a Issue to compare with the 'b' issue
     * @param b Issue to compare with the 'a' issue
     * @returns 'a' is before (<0) / equal to (0) / after (>0) 'b'
     */
    static compare(a: Issue, b: Issue): number {
        const order = IssueSeverity.compare(a.data.severity, b.data.severity);
        return order !== 0 ? order : a.rule.id.localeCompare(b.rule.id);
    }
}

/**
 * A bad practice that needs to be fixed,
 * returned by a page analyser.
 */
export interface IssueData {

    /** Issue rule unique identifier */
    readonly id: RuleId;

    /** Issue severity */
    readonly severity: IssueSeverity;

    /** Issue additional details */
    readonly details?: string;

    /** Issue occurrences count (default: 1) */
    readonly occurrences?: number;

}

/**
 * Issue severity level
 */
export class IssueSeverity {

    /**
     * A finding worth mentioning but not serious
     */
    static Info = new IssueSeverity(0, "info");

    /**
     * An issue that have a minor responsibility in the environmental
     * impact of the application, it should be fixed.
     */
    static Minor = new IssueSeverity(1, "minor");

    /**
     * An issue that have a major responsibility in the environmental
     * impact of the application, it should be promptly fixed.
     */
    static Major = new IssueSeverity(2, "major");

    /**
     * An issue that have a massive responsibility in the environmental
     * impact of the application, fixing it will hugely reduce the impact.
     */
    static Critical = new IssueSeverity(3, "critical");

    /**
     * Initialise an issue severity level.
     * @param value Numeric severity level
     * @param label Severity level name
     */
    private constructor(
        readonly value: number,
        readonly label: "info" | "minor" | "major" | "critical"
    ) { }

    /**
     * Shift the severity level up or down.
     * @param s Initial severity level
     * @param offset Level offset (negative/positive to lower/increase the severity)
     * @returns The output issue severity level
     */
    shift(offset: number): IssueSeverity {
        const i = IssueSeverities.indexOf(this);
        if (i < 0) { // Unknown severity level
            return this;
        }
        const j = Math.max(Math.min(i + offset, IssueSeverities.length), 0);
        return IssueSeverities[j];
    }

    /**
     * @returns The string representation of this severity level
     */
    toString() {
        return this.label
    }

    /**
     * @returns The object to serialize as JSON
     */
    toJSON() {
        return this.label;
    }

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

    /**
     * Determine whether the 'a' issue severity level is before, equal or after
     * the 'b' issue severity level.
     * @param a Issue severity level to compare with the 'b' issue severity level
     * @param b Issue severity level to compare with the 'a' issue severity level
     * @returns 'a' is before (<0) / equal to (0) / after (>0) 'b'
     */
    static compare(a: IssueSeverity, b: IssueSeverity): number {
        return b.value - a.value;
    }

}

/**
 * Issue severity levels
 */
export const IssueSeverities = [
    IssueSeverity.Info,
    IssueSeverity.Minor,
    IssueSeverity.Major,
    IssueSeverity.Critical
];
