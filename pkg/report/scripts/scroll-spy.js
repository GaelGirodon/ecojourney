/**
 * Automatically update a navigation menu based on scroll position
 * to indicate which link is currently active in the viewport.
 */
export class ScrollSpy {

    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => entries.forEach((entry) =>
                this.toggle(entry.target, entry.isIntersecting)),
            { rootMargin: "-39.9% 0px -60% 0px" }
        );
    }

    /**
     * Spy some page section elements, each one must contain
     * a title as direct child with links referencing their id.
     * @param {Element[]} sections Page sections to spy
     * @returns this
     */
    spy(sections) {
        sections.forEach(el => this.observer.observe(el));
        return this;
    }

    /**
     * Toggle the link associated to the given section.
     * @param {Element} section Section entering or leaving the viewport
     * @param {boolean} activate Activate or deactivate the associated link
     * @private
     */
    toggle(section, activate) {
        const id = section.querySelector(":scope > .title")?.getAttribute("id");
        if (id) {
            document.querySelector(`a[href="#${id}"]`)
                ?.classList[activate ? "add" : "remove"]("is-active");
        }
    }

}
