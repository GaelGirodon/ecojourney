import http from "node:http";
import https from "node:https";

/**
 * Send an HTTP request.
 * This function is a basic wrapper around Node.js http[s].request() to be used
 * internally until the Fetch API reaches a stable state (it has some weird
 * behavior for now like hanging the Mocha process during E2E testing).
 * @param url The target URL
 * @param opts Request options
 * @returns The HTTP response
 */
export async function request(url: string, opts: RequestOptions): Promise<Response> {
    const u = new URL(url);
    const options = {
        hostname: u.hostname,
        port: u.port,
        path: `${u.pathname}${u.search}`,
        headers: {},
        ...opts
    };
    if (opts.body) {
        options.headers["Content-Length"] = opts.body.byteLength;
    }

    const proto = u.protocol.slice(0, -1) as "http" | "https";
    return new Promise((resolve, reject) => {
        const req = ({ http, https })[proto].request(options, (res) => {
            let data = "";
            res.setEncoding("utf8");
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                resolve({
                    status: res.statusCode ?? 500,
                    text: async () => data,
                    json: async () => JSON.parse(data)
                });
            });
        }).on("error", (e) => {
            reject(e);
        });

        if (opts.body) {
            req.write(opts.body);
        }
        req.end();
    });
}

/**
 * HTTP request options
 */
export type RequestOptions = http.RequestOptions & { body?: Buffer };


/**
 * HTTP response
 */
export interface Response {

    /** HTTP status code */
    status: number,

    /** Get the response body as a raw string */
    text(): Promise<string>,

    /** Get the response body parsed from JSON */
    json(): Promise<any>

}
