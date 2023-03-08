import { Collapse } from "./collapse";
import { ScrollSpy } from "./scroll-spy";

new ScrollSpy()
    .spy(document.querySelectorAll("[data-spy]"));

document.querySelectorAll("[data-collapse]")
    .forEach(el => new Collapse(el));
