import { defineConfig } from "vite";
import { publish, stub } from "./vite.plugins";

export default defineConfig({
    plugins: [
        stub("./data/report.html.json"),
        publish("../../src/audit/report/html/template.html")
    ],
});
