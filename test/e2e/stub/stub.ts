import express from "express";
import { cpSync, mkdirSync } from "node:fs";
import { Server } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import prompts from "prompts";

const app = express();
const port = 3000;
const stubRoot = fileURLToPath(dirname(import.meta.url));
const projectRoot = join(stubRoot, "../../..");

// Setup views
app.set("view engine", "ejs");
app.set("views", join(stubRoot, "views"));

// Setup static assets
mkdirSync(join(stubRoot, "static"), { recursive: true });
cpSync(join(projectRoot, "node_modules/@picocss/pico/css/pico.css"),
    join(stubRoot, "static/pico.css"));
app.use(express.static(join(stubRoot, "static")));

// Serve home page
app.get("/", (_req, res) => {
    res.render("index", { page: "home", title: "Home" });
});

// Serve other pages
app.get("/:page(\\w+)", (req, res) => {
    const page = req.params.page;
    res.render(page, { page, title: page.charAt(0).toUpperCase() + page.slice(1) });
});

/**
 * Start the stub server
 * @returns The stub server
 */
export function start(): Promise<Server> {
    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            console.log(`Stub app listening on port ${port}`);
            resolve(server);
        });
    })
}

// Start the stub server when called from the command line
if (import.meta.url === pathToFileURL(process.argv.slice(-1)[0]).href) {
    const server = await start();
    await prompts({
        type: "text",
        name: "stop",
        message: "Press Enter to stop the stub server"
    });
    server.close();
}
