/**
 * Control the visibility of a block from another element.
 */
export class Collapse {

    /**
     * Enable a controller element to toggle the visibility
     * of a collapsible element.
     * @param {Element} ctrl Collapsible controller
     */
    constructor(ctrl) {
        ctrl.addEventListener("click", () => {
            const selector = ctrl.getAttribute("data-collapse");
            const target = document.querySelector(selector);
            const collapsed = target.classList.toggle("is-hidden");
            ctrl.setAttribute("aria-expanded", !collapsed);
        });
    }

}
