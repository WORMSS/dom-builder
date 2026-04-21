type AngleUnits = `${number}deg` | `${number}turn` | `${number}grad` | `${number}rad`;
type SideOrCorner = `to ${'left' | 'right' | 'bottom' | 'top'}` | `to ${'left' | 'right'} ${'top' | 'bottom'}`;
type LinearGradiantDir = SideOrCorner | AngleUnits;
/**
 * Utility functions for generating CSS values and structures.
 */
declare const StyleUtils: {
    /**
     * Generates a CSS linear-gradient string.
     * @param dir The direction of the gradient (e.g., 'to right', '45deg').
     * @param values The color stop values for the gradient.
     * @returns A linear-gradient CSS string, or an empty string if no colors are provided.
     */
    readonly linearGradiant: (dir: LinearGradiantDir, ...values: (string | undefined)[]) => string;
    /**
     * Joins a list of values into a comma-separated string.
     * @param values The values to join.
     * @returns A comma-separated string, or undefined if no valid values are provided.
     */
    readonly list: (...values: (string | undefined)[]) => string | undefined;
    /**
     * Generates a CSS rgb() or rgba() color string.
     * @param r The red component (0-255).
     * @param g The green component (0-255).
     * @param b The blue component (0-255).
     * @param a The optional alpha (transparency) component (0-1).
     * @returns An rgb or rgba CSS string.
     */
    readonly rgb: (r: number, g: number, b: number, a?: number) => string;
    /**
     * Generates a CSS hsl() color string.
     * @param hue The hue value (number for turns, or a string with units).
     * @param saturation The saturation percentage (0-100).
     * @param lightness The lightness percentage (0-100).
     * @param alpha The optional alpha (transparency) component (0-1).
     * @returns An hsl CSS string.
     */
    readonly hsl: (hue: number | AngleUnits, saturation: number, lightness: number, alpha?: number) => string;
    /**
     * Wraps a string in a CSS url() function.
     * @param url The URL string.
     * @returns A url() CSS string.
     */
    readonly url: (url: string) => string;
};

/**
 * Valid CSS property names derived from CSSStyleDeclaration.
 */
type StyleRulesKeys = Exclude<keyof CSSStyleDeclaration, 'getPropertyPriority' | 'getPropertyValue' | 'item' | 'removeProperty' | 'setProperty' | 'parentRule' | 'length' | `webkit${string}` | number | symbol>;
/**
 * Interface representing a collection of CSS style rules with chainable methods
 * for every CSS property.
 */
type StyleRules = Record<StyleRulesKeys, (value: string | undefined) => StyleRules> & {
    /**
     * Iterates over the CSS rules, yielding strings like "property: value;".
     */
    [Symbol.iterator](): IterableIterator<string>;
    /**
     * Returns the number of style rules defined.
     */
    readonly length: number;
    /**
     * Sets a custom CSS property.
     * @param name The CSS property name.
     * @param value The value for the property.
     * @returns The StyleRules instance for chaining.
     */
    setProperty(name: string, value: string | undefined): StyleRules;
    /**
     * Constructs a new StyleRules instance.
     */
    new (): StyleRules;
    /**
     * Provides access to style utility functions.
     */
    utils: typeof StyleUtils;
};
/**
 * A chainable API for defining CSS styles. Uses a Proxy to support all
 * standard CSS properties as method calls.
 */
declare const StyleRules: StyleRules;

/**
 * Represents a DOM element and provides a chainable API for building its structure,
 * attributes, classes, and styles.
 */
declare class Dom {
    #private;
    /**
     * Creates a new Dom instance with the specified tag name.
     * @param tagname The HTML tag name for this element.
     */
    constructor(tagname: string);
    /**
     * Appends children to this element. Children can be other Dom instances,
     * strings, or functions that return a string or Dom instance.
     * @param children The children to append.
     * @returns The current Dom instance for chaining.
     */
    append(...children: (Dom | string | (() => string | Dom | undefined | null) | undefined | null)[]): this;
    /**
     * Adds an attribute or multiple attributes to the element.
     * @param attributes A record of attribute names and values. Values can be strings or functions that return a string.
     * @returns The current Dom instance for chaining.
     */
    attribute(attributes: Record<string, string | (() => string | undefined) | undefined>): this;
    /**
     * Adds an attribute to the element.
     * @param name The name of the attribute.
     * @param value The value of the attribute. If undefined, the attribute is ignored. Can be a string or a function that returns a string.
     * @returns The current Dom instance for chaining.
     */
    attribute(name: string, value: string | (() => string | undefined) | undefined): this;
    /**
     * Adds a class to the element's class list.
     * @param value The class name to add. If undefined or empty, it's ignored. Can be a string or a function that returns a string.
     * @returns The current Dom instance for chaining.
     */
    class(value: string | (() => string | undefined) | undefined): this;
    /**
     * Configures the styles for this element using a setter function.
     * @param setter A function that receives a StyleRules instance to configure styles.
     * @returns The current Dom instance for chaining.
     */
    style(setter: (style: StyleRules) => void): this;
    /**
     * Allows using a middleware or a custom function to configure the current Dom instance.
     * @param setter A function that receives the current Dom instance.
     * @returns The current Dom instance for chaining.
     */
    use(setter: (dom: this) => void): this;
    /**
     * Returns the string representation of the DOM element, including its tag,
     * attributes, classes, styles, and children.
     * @returns The HTML string.
     */
    toString(): string;
    /**
     * Generates the opening tag string including attributes, classes, and styles.
     * @returns The opening tag string (without brackets).
     */
    protected toStringTagOpener(): string;
    /**
     * Generates the string representation of all children.
     * @returns The combined string of all children.
     */
    protected toStringChildren(): string;
}

/**
 * Factory function to create a new Dom instance with the specified tag name.
 * @param tagname The HTML tag name for the element.
 * @returns A new Dom instance.
 */
declare function createElement(tagname: string): Dom;

/**
 * Represents the top-level HTML document structure.
 * Automatically includes <!DOCTYPE html> and <html>, <head>, and <body> tags.
 */
declare class Html extends Dom {
    #private;
    /**
     * Creates a new Html instance and initializes it with head and body elements.
     */
    constructor();
    /**
     * Configures the <head> element using a setter function.
     * @param setter A function that receives the head Dom instance.
     * @returns The current Html instance for chaining.
     */
    head(setter: (head: Dom) => void): this;
    /**
     * Configures the <body> element using a setter function.
     * @param setter A function that receives the body Dom instance.
     * @returns The current Html instance for chaining.
     */
    body(setter: (body: Dom) => void): this;
    /**
     * Adds a stylesheet rule to the document's head.
     * @param selector The CSS selector for the rule.
     * @param setter A function that receives a StyleRules instance or a record of style properties.
     * @returns The current Html instance for chaining.
     */
    stylesheet(selector: string, setter: ((style: StyleRules) => void) | Partial<Record<StyleRulesKeys, string | undefined>>): this;
    /**
     * Returns the string representation of the full HTML document,
     * including the DOCTYPE declaration.
     * @returns The complete HTML document string.
     */
    toString(): string;
}

/**
 * Options for configuring a new HTML document.
 */
interface CreateHtmlOptions {
    /**
     * The text for the <title> tag.
     */
    title?: string;
    /**
     * The value for the lang attribute of the <html> tag.
     * @default en
     */
    lang?: string;
    /**
     * Whether to include a default viewport meta tag for mobile responsiveness.
     * @default true
     */
    mobileMeta?: boolean;
    /**
     * The value for the charset meta tag in the <head>.
     * @default utf-8
     */
    charset?: string;
    /**
     * Configuration for the <base> tag.
     */
    base?: {
        /**
         * The base URL for all relative URLs in the document.
         */
        url?: string;
        /**
         * The default target for all hyperlinks and forms in the document.
         */
        target?: string;
    };
}
/**
 * Factory function to create and configure a new Html document instance.
 * @param options The options for the document.
 * @returns A new, configured Html instance.
 */
declare function createHtml(options?: CreateHtmlOptions): Html;

/**
 * Primitive JSON-serializable types.
 */
type Json = string | number | boolean | null | Json[] | {
    [key: string]: Json;
};
/**
 * Creates a <script> element containing an immediately invoked function expression (IIFE).
 * @param func The function to be executed in the script.
 * @param data The arguments to be passed to the function (must be JSON-serializable).
 * @returns A Dom instance representing the <script> element.
 */
declare function createScript<T extends Json[]>(func: (...args: T) => void, ...data: T): Dom;

export { Dom, Html, StyleRules, StyleUtils, createElement, createHtml, createScript };
