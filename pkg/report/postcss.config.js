import purgecss from "@fullhuman/postcss-purgecss";

export default {
    plugins: [
        purgecss({
            content: ["./**/*.html"],
            safelist: [/^[gs]-/, "code"],
            dynamicAttributes: ["aria-expanded"]
        })
    ]
};
