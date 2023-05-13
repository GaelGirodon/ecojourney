import { createIssueModalContent } from "./elements/issue-modal-content";

/**
 * Control the modal allowing to display details
 * about an issue and the associated rule.
 */
export class IssueModal {

    /**
     * Enable issues to open the modal on click.
     * @param {HTMLElement[]} issues Issue row elements
     * @param {HTMLElement} modal Issue modal
     * @param {{[id: string]: *}[]} rules Rules definition
     */
    constructor(issues, modal, rules) {
        this.content = modal.querySelector(".modal-content");

        // Open the modal on click on an issue element
        issues.forEach(el => el.addEventListener("click", e => {
            e.preventDefault();
            this.content.append(createIssueModalContent(
                rules[el.getAttribute("data-rule-id")],
                el.querySelector(".severity").textContent?.trim(),
                el.querySelector(".details").innerHTML?.trim()
            ));
            modal.classList.add("is-active");
            document.documentElement.classList.add("is-clipped");
        }));

        // Close the modal on click on the background or on the close button
        modal.querySelectorAll(".modal-background, .modal-close")
            .forEach(el => el.addEventListener("click", () => {
                el.parentElement.classList.remove("is-active");
                document.documentElement.classList.remove("is-clipped");
                this.content.innerHTML = "";
            }));
    }

}
