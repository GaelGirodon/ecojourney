import { defineConfig } from "vite";
import { stub, publish } from "./vite.plugins";

export default defineConfig({
    plugins: [
        stub("./data/report.html.json"),
        publish("../../src/audit/report/html/template.html")
    ],
});
