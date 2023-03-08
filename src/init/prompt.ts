import { existsSync } from "node:fs";
import { dirname } from "node:path";
import { PromptObject } from "prompts";
import { isHttpUrl } from "../util/validation.js";

/**
 * Build the list of questions to ask to the user
 * in order to build a good starter manifest file.
 * @param path Manifest file path from the command line argument
 * @returns Questions to prompt
 */
export function questions(path?: string): PromptObject[] {
    return [
        {
            type: path ? null : "text",
            name: "path",
            message: "Manifest file location:",
            initial: "ecojourney.yml",
            validate: (v: string) => {
                if (!v) return "Path is required";
                if (!v.match(/.ya?ml$/)) return "Manifest must be a YAML file";
                const dir = dirname(v);
                if (!existsSync(dir)) return `Directory '${dir}' doesn't exist`;
                return true;
            }
        },
        {
            type: "text",
            name: "name",
            message: "Web application name:"
        },
        {
            type: "text",
            name: "description",
            message: "Web application description:"
        },
        {
            type: "text",
            name: "url",
            message: "Web application root URL:",
            validate: (v) => v && isHttpUrl(v) ? true : "A valid HTTP(S) URL is required"
        },
        {
            type: "select",
            name: "proxy",
            message: "Proxy server:",
            choices: [
                { title: "No proxy", description: "Web application can be reached without using a proxy", value: false },
                { title: "Environment", description: "Use HTTP_PROXY and NO_PROXY environment variables", value: "env" },
                { title: "Custom", description: "Type a custom proxy server address", value: "custom" }
            ]
        },
        {
            type: prev => prev === "custom" ? "text" : null,
            name: "proxyServer",
            message: "Proxy server address:",
            validate: (v) => v && isHttpUrl(v) ? true : "A valid HTTP(S) proxy server address is required"
        },
        {
            type: (_, values) => values.proxy ? "toggle" : null,
            name: "proxyAuth",
            message: "Proxy authentication?",
            initial: false,
            active: "yes",
            inactive: "no"
        },
        {
            type: "select",
            name: "template",
            message: "Starter template:",
            choices: [
                { title: "Basic", description: "Analyse the root URL/page", value: "basic" },
                { title: "Simple", description: "Analyse a simple browsing scenario with multiple pages", value: "simple" },
                { title: "Intermediate", description: "Analyse multiple browsing scenarios with multiple pages", value: "intermediate" },
                { title: "Advanced", description: "Analyse complex scenarios with factorised actions (e.g. login)", value: "advanced" }
            ]
        },
        {
            type: "toggle",
            name: "schema",
            message: "Include $schema reference?",
            initial: true,
            active: "yes",
            inactive: "no"
        }
    ];
}
