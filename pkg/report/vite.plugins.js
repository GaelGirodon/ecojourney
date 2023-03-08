import { render } from "ejs";
import { readFileSync } from "fs";
import { writeFile } from "fs/promises";

/**
 * Inject stub data for development.
 * @param {string|URL} path Path to the stub report file
 * @returns Vite plugin
 */
export function stub(path) {
    return {
        name: "stub",
        apply: "serve",
        transformIndexHtml(html) {
            const data = JSON.parse(readFileSync(path, { encoding: "utf8" }));
            return html.includes("{%") ? render(html, data, {
                openDelimiter: "{",
                closeDelimiter: "}"
            }) : html;
        }
    }
};

/**
 * Inline assets (JS, CSS and SVG in CSS) and write
 * the report template to the given location.
 * @param {string|URL} path Path to the report template output file
 * @returns Vite plugin
 */
export function publish(path) {
    return {
        name: "publish",
        apply: "build",
        async writeBundle(_options, bundle) {
            const html = bundle["index.html"].source
                // Replace EJS delimiters with default ones
                .replace(/{%/g, "<%").replace(/%}/g, "%>")
                // Remove comments
                .replace(/\n *<!-- .+ -->/g, "")
                // Inline JS
                .replace(/<script[^>]+ src="\/([^"]+\.js)"><\/script>/g,
                    (_, src) => `<script type="module">${bundle[src].code.trim()}</script>`)
                // Inline CSS
                .replace(/<link rel="stylesheet" href="\/([^"]+\.css)">/g, (_, href) => {
                    const style = bundle[href].source
                        // Inline SVG
                        .replace(/url\(\/([^\)]+\.svg)\)/g, (_, name) =>
                            `url(data:image/svg+xml;base64,${bundle[name]
                                .source.toString("base64").trim()})`);
                    return `<style>${style.trim()}</style>`;
                })
                // Clean new lines
                .replace(/^ +$/gm, "").replace(/\n{2,}/g, "\n");
            await writeFile(path, html, { encoding: "utf8" });
        }
    }
}
