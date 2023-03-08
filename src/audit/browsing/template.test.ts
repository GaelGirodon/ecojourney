import assert from "node:assert";
import { render, renderObject } from "./template.js";

describe("template", () => {
    const data = {
        env: { HTTP_PROXY: "proxy" },
        args: { username: "admin" }
    };

    describe("#render()", () => {
        for (const t of [
            { value: "", output: "" },
            { value: "no template", output: "no template" },
            { value: "forbidden <%= ejs %>", output: "forbidden <%= ejs %>" },
            { value: "{{ env.HTTP_PROXY }}", output: "proxy" },
            { value: "user: {{ args.username }}", output: "user: admin" }
        ]) {
            it(`should render "${t.value}" as "${t.output}"`, () => {
                assert.strictEqual(render(t.value, data), t.output);
            });
        }
    });

    describe("#renderMap()", () => {
        it("should render all object values", () => {
            assert.deepStrictEqual(renderObject({
                proxy: "{{ env.HTTP_PROXY }}",
                constant: "CONSTANT",
                user: "{{ args.username }}"
            }, data), {
                proxy: "proxy",
                constant: "CONSTANT",
                user: "admin"
            });
        });

        it("should render all object values, recursively", () => {
            assert.deepStrictEqual(renderObject({
                proxy: "{{ env.HTTP_PROXY }}",
                constant: "CONSTANT",
                user: "{{ args.username }}",
                nested: {
                    user: "{{ args.username }}",
                    num: 42
                }
            }, data), {
                proxy: "proxy",
                constant: "CONSTANT",
                user: "admin",
                nested: {
                    user: "admin",
                    num: 42
                }
            });
        });
    });
});
