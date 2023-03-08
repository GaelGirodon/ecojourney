import ejs from "ejs";
import log from "../../util/log.js";

/**
 * Render a value template with the given data.
 * @param value The template to render
 * @param data The data injectable in the template
 * @returns The rendered string
 */
export function render(value: string, data: ejs.Data) {
    log.debug("Render template '%s'", value);
    if (!value || !value.includes("{{") || value.includes("<%")) {
        return value;
    }
    const template = value.replace(/\{\{([^}]+)}}/g, "<%=$1%>");
    return ejs.render(template, data);
}

/**
 * Render all object templated values with the given data.
 * @param value The object with templated values to render
 * @param data The data injectable in templates
 * @returns The rendered object
 */
export function renderObject(value: { [key: string]: any }, data: ejs.Data) {
    let output = Object.assign({}, value);
    for (const key of Object.keys(value)) {
        const v = value[key];
        if (v?.constructor.name === "Object") {
            output[key] = renderObject(v, data);
        } else if (typeof v === "string" || v instanceof String) {
            output[key] = render(v as string, data);
        }
    }
    return output;
}
