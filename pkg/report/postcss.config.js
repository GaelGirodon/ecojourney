import purgecss from "@fullhuman/postcss-purgecss";

export default {
    plugins: [
        purgecss({
            content: ["./**/*.html", "./scripts/elements/*.js"],
            safelist: [/^[gs]-/, "code"],
            dynamicAttributes: ["aria-expanded"]
        })
    ]
};
