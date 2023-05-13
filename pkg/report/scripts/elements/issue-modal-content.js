import { h } from "../builder";

/**
 * Generate the issue modal content.
 * @param {*} Rule Rule to display
 * @param {string} severity Issue severity label
 * @param {string} details Issue details
 * @returns {HTMLElement} The content element
 */
export function createIssueModalContent(rule, severity, details) {
    return h("div").classes("box").children(
        h("div").classes("severity", `s-${severity}`, "is-pulled-right").children(severity).get(),
        h("p").classes("title", "is-4").children(rule.name).get(),
        h("p").classes("mb-4").children(rule.description).get(),
        details ? h("div").classes("message").children(
            h("div").classes("message-body").html(details).get()
        ).get() : null,
        rule.references?.length > 0 ? h("div").children(
            h("p").classes("title", "is-5", "mb-4").children("References").get(),
            h("div").classes("tags").children(
                ...rule.references.map(r => h("span").classes("tag").children(
                    r.url ? h("a").attr("href", r.url).attr("target", "_blank")
                        .children(r.name).get() : r.name
                ).get())
            ).get()
        ).get() : null
    ).get();
}
