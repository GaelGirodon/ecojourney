/**
 * Initialise an element to build.
 * @param {string} tagName HTML element tag name
 * @returns The element fluent builder
 */
export function h(tagName) {
    return new ElementBuilder(tagName);
}

/**
 * DOM element fluent builder
 */
export class ElementBuilder {

    /**
     * Initialise an element to build.
     * @param {string} tagName HTML element tag name
     */
    constructor(tagName) {
        this.element = document.createElement(tagName);
    }

    /**
     * Set class attribute.
     * @param {string[]} classes CSS classes
     * @returns this
     */
    classes(...classes) {
        this.element.classList.add(...classes);
        return this;
    }

    /**
     * Set an attribute.
     * @param {string} name Attribute name
     * @param {string} value Attribute value
     * @returns this
     */
    attr(name, value) {
        this.element.setAttribute(name, value);
        return this;
    }

    /**
     * Set inner HTML content.
     * @param {string} html Inner raw HTML
     * @returns this
     */
    html(html) {
        this.element.innerHTML = html;
        return this;
    }

    /**
     * Set child elements.
     * @param {(string | HTMLElement | null)[]} children Child elements
     * @returns this
     */
    children(...children) {
        this.element.append(...children.filter(c => c));
        return this;
    }

    /**
     * Get the built element.
     * @returns {HTMLElement} The built HTML element.
     */
    get() {
        return this.element;
    }

}
