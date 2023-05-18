/**
 * InfluxDB connection configuration
 */
export interface InfluxDBConfig {

    /** Base URL */
    url: string;

    /** Authentication token */
    token: string;

    /** Destination organisation for writes */
    org: string;

    /** Destination bucket for writes */
    bucket: string;

    /** Measurement name prefix */
    prefix: string;

}
