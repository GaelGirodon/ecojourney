import ejs from "ejs";
import { readFile, writeFile } from "fs/promises";
import { basename } from "path";
import prompts from "prompts";
import { stringify } from "yaml";
import { InitOptions } from "./options.js";
import { questions } from "./prompt.js";
import { schema } from "./schema.js";

/**
 * Initialise a manifest file.
 * @param path Path to the audit manifest file to create
 * @param opts Commande line options
 */
export async function init(path: string | undefined, opts: InitOptions) {
    // Interactive questionnaire
    const res = await prompts(questions(path), {
        onCancel: () => {
            throw new Error("Manifest file initialisation cancelled");
        }
    });

    // Prepare data for injection in the manifest template
    const data = Object.assign({}, res, {
        path: path ?? res.path,
        schemaUrl: await schema()
    });

    // Generate the manifest from the template and responses
    console.log(`\nGenerating manifest file ${data.path}...`);
    const template = (await readFile(new URL("./template.yml", import.meta.url),
        { encoding: "utf8" }));
    const manifest = ejs.render(template, data, {
        escape: (v: string) => stringify(v)?.trim() ?? ""
    });
    await writeFile(path ?? res.path, manifest, { encoding: "utf8" });

    // Print next steps
    console.log("\nDone. You can now:\n");
    console.log(`- Open and edit ${basename(data.path)} in your favorite code editor`);
    if (data.template.actions || data.proxy) {
        console.log("- Enable validation and autocompletion by installing the YAML extension"
            + "\n  on VS Code or by configuring schema association manually using the"
            + "\n  schema URL in your IDE settings");
    }
    if (data.template.actions || data.proxy) {
        console.log("- Configure sensitive data using environment variables");
    }
    console.log(`- Run the analysis:\n\n    ecojourney audit ${data.path}\n`);
}
