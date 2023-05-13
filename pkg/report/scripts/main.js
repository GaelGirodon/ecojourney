import { Collapse } from "./collapse";
import { IssueModal } from "./issue-modal";
import { ScrollSpy } from "./scroll-spy";

new ScrollSpy()
    .spy(document.querySelectorAll("[data-spy]"));

document.querySelectorAll("[data-collapse]")
    .forEach(el => new Collapse(el));

new IssueModal(document.querySelectorAll(".issue"),
    document.querySelector("#issue-modal"), rules);
