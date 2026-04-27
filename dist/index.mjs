import { GenStack } from "@wormss/genstack";
import { kebabCase } from "change-case";
//#region src/StyleUtils.ts
/**
* Utility functions for generating CSS values and structures.
*/
const StyleUtils = {
	/**
	* Generates a CSS linear-gradient string.
	* @param dir The direction of the gradient (e.g., 'to right', '45deg').
	* @param values The color stop values for the gradient.
	* @returns A linear-gradient CSS string, or an empty string if no colors are provided.
	*/
	linearGradiant(dir, ...values) {
		const colours = GenStack.from(values).filterUndefined().map((s) => s.trim()).filter((s) => !!s).toArray().join(", ");
		if (!colours) return "";
		return `linear-gradient(${dir}, ${colours})`;
	},
	/**
	* Joins a list of values into a comma-separated string.
	* @param values The values to join.
	* @returns A comma-separated string, or undefined if no valid values are provided.
	*/
	list(...values) {
		const list = GenStack.from(values).filterUndefined().map((s) => s.trim()).filter((s) => !!s).toArray().join(", ");
		if (!list) return void 0;
		return list;
	},
	/**
	* Generates a CSS rgb() or rgba() color string.
	* @param r The red component (0-255).
	* @param g The green component (0-255).
	* @param b The blue component (0-255).
	* @param a The optional alpha (transparency) component (0-1).
	* @returns An rgb or rgba CSS string.
	*/
	rgb(r, g, b, a) {
		return `rgb(${GenStack.from([
			r,
			g,
			b,
			a
		]).filterUndefined().toArray().join(", ")})`;
	},
	/**
	* Generates a CSS hsl() color string.
	* @param hue The hue value (number for turns, or a string with units).
	* @param saturation The saturation percentage (0-100).
	* @param lightness The lightness percentage (0-100).
	* @param alpha The optional alpha (transparency) component (0-1).
	* @returns An hsl CSS string.
	*/
	hsl(hue, saturation, lightness, alpha) {
		return `hsl(${typeof hue === "string" ? hue : `${hue}turn`}, ${saturation}%, ${lightness}%${typeof alpha === "number" ? `/ ${alpha}` : ""})`;
	},
	/**
	* Wraps a string in a CSS url() function.
	* @param url The URL string.
	* @returns A url() CSS string.
	*/
	url(url) {
		return `url('${url}')`;
	}
};
//#endregion
//#region src/StyleRules.ts
/**
* A chainable API for defining CSS styles. Uses a Proxy to support all
* standard CSS properties as method calls.
*/
const StyleRules = new Proxy(function StyleRules() {}, { 
/**
* Constructs a new Proxy-based StyleRules instance.
*/
construct(target) {
	const map = /* @__PURE__ */ new Map();
	return new Proxy(new target(), { 
	/**
	* Dynamically handles method calls for CSS properties and other built-in properties.
	*/
get(target, prop, me) {
		if (typeof prop === "symbol") switch (prop) {
			case Symbol.iterator: return () => GenStack.from(map.entries()).map(([k, v]) => `${k}: ${v};`);
			case Symbol.toStringTag: return target.name;
			default: return Reflect.get(target, prop);
		}
		switch (prop) {
			case "toString":
 /**
			* Returns the string representation of all defined style rules.
			*/
			return () => [...me].join(" ");
			case "length":
 /**
			* Returns the number of defined style rules.
			*/
			return map.size;
			case "setProperty":
 /**
			* Sets a raw CSS property.
			*/
			return (name, value) => {
				value = value?.trim();
				if (value) map.set(name, value);
				return me;
			};
			case "utils":
 /**
			* Returns the StyleUtils utility class.
			*/
			return StyleUtils;
			default:
 /**
			* Handles arbitrary CSS properties (converted to kebab-case).
			*/
			return (value) => {
				value = value?.trim();
				if (value) map.set(kebabCase(prop), value);
				return me;
			};
		}
	} });
} });
//#endregion
//#region src/Dom.ts
/**
* Represents a DOM element and provides a chainable API for building its structure,
* attributes, classes, and styles.
*/
var Dom = class {
	#tagname;
	#children = [];
	#attributes = /* @__PURE__ */ new Map();
	#classList = /* @__PURE__ */ new Set();
	#style = new StyleRules();
	/**
	* Creates a new Dom instance with the specified tag name.
	* @param tagname The HTML tag name for this element.
	*/
	constructor(tagname) {
		this.#tagname = tagname;
	}
	/**
	* Appends children to this element. Children can be other Dom instances,
	* strings, or functions that return a string or Dom instance.
	* @param children The children to append.
	* @returns The current Dom instance for chaining.
	*/
	append(...children) {
		this.#children.push(...GenStack.from(children).filterNullUndefined());
		return this;
	}
	attribute(nameOrAttributes, value) {
		if (typeof nameOrAttributes === "string") {
			const name = nameOrAttributes;
			if (value === void 0) return this;
			this.#attributes.set(name, value);
		} else {
			const attributes = nameOrAttributes;
			for (const [name, value] of Object.entries(attributes)) {
				if (value === void 0) continue;
				this.#attributes.set(name, value);
			}
		}
		return this;
	}
	/**
	* Adds a class to the element's class list.
	* @param value The class name to add. If undefined or empty, it's ignored. Can be a string or a function that returns a string.
	* @returns The current Dom instance for chaining.
	*/
	class(value) {
		if (typeof value === "function") {
			this.#classList.add(value);
			return this;
		}
		value = value?.trim();
		if (value) this.#classList.add(value);
		return this;
	}
	/**
	* Configures the styles for this element using a setter function.
	* @param setter A function that receives a StyleRules instance to configure styles.
	* @returns The current Dom instance for chaining.
	*/
	style(setter) {
		setter(this.#style);
		return this;
	}
	/**
	* Allows using a middleware or a custom function to configure the current Dom instance.
	* @param setter A function that receives the current Dom instance.
	* @returns The current Dom instance for chaining.
	*/
	use(setter) {
		setter(this);
		return this;
	}
	/**
	* Returns the string representation of the DOM element, including its tag,
	* attributes, classes, styles, and children.
	* @returns The HTML string.
	*/
	toString() {
		const children = this.toStringChildren();
		return `<${this.toStringTagOpener()}>${children}</${this.#tagname}>`;
	}
	/**
	* Generates the opening tag string including attributes, classes, and styles.
	* @returns The opening tag string (without brackets).
	*/
	toStringTagOpener() {
		const tagOpener = [this.#tagname, ...GenStack.from(this.#attributes.entries()).map(([k, v]) => {
			const val = typeof v === "function" ? v() : v;
			if (val === void 0) return void 0;
			return val === "" ? k : `${k}="${val}"`;
		}).filterNullUndefined()];
		if (this.#classList.size) {
			const classes = GenStack.from(this.#classList).map((c) => typeof c === "function" ? c() : c).filterNullUndefined().map((c) => c.trim()).filter((c) => c.length > 0).toArray();
			if (classes.length) tagOpener.push(`class="${classes.join(" ")}"`);
		}
		if (this.#style.length) tagOpener.push(`style="${this.#style.toString()}"`);
		return tagOpener.join(" ");
	}
	/**
	* Generates the string representation of all children.
	* @returns The combined string of all children.
	*/
	toStringChildren() {
		return this.#children.map((c) => {
			if (typeof c === "function") return c()?.toString() ?? "";
			else return c.toString();
		}).join("");
	}
};
//#endregion
//#region src/createElement.ts
/**
* Factory function to create a new Dom instance with the specified tag name.
* @param tagname The HTML tag name for the element.
* @returns A new Dom instance.
*/
function createElement(tagname) {
	return new Dom(tagname);
}
//#endregion
//#region src/Style.ts
/**
* Represents a <style> element that manages a collection of CSS rules.
*/
var Style = class extends Dom {
	#stylesheets = /* @__PURE__ */ new Map();
	/**
	* Creates a new Style instance (a <style> tag).
	*/
	constructor() {
		super("style");
	}
	/**
	* Adds or updates a CSS rule in the stylesheet.
	* @param selector The CSS selector (e.g., 'body', '.my-class', '#my-id').
	* @param setter A function that receives a StyleRules instance or a record of style properties.
	* @returns The current Style instance for chaining.
	*/
	stylesheet(selector, setter) {
		const style = new StyleRules();
		if (typeof setter === "function") setter(style);
		else for (const [key, value] of Object.entries(setter)) style[key](value);
		this.#stylesheets.set(selector, style);
		return this;
	}
	/**
	* Returns the number of non-empty stylesheet rules defined.
	*/
	get length() {
		return GenStack.from(this.#stylesheets.values()).filter((s) => s.length > 0).toArray().length;
	}
	/**
	* Generates the CSS string for all rules managed by this style element.
	* @returns The complete CSS string.
	*/
	toStringStylesheet() {
		return [...GenStack.from(this.#stylesheets.entries()).filter(([_, style]) => style.length).map(([key, style]) => `${key} { ${style.toString()} }`)].join(" ");
	}
	/**
	* Combines children and the generated stylesheet string.
	* @returns The string representation of the style element's contents.
	*/
	toStringChildren() {
		return super.toStringChildren() + this.toStringStylesheet();
	}
};
//#endregion
//#region src/Html.ts
/**
* Represents the top-level HTML document structure.
* Automatically includes <!DOCTYPE html> and <html>, <head>, and <body> tags.
*/
var Html = class extends Dom {
	#head = createElement("head");
	#stylesheet = new Style();
	#body = createElement("body");
	/**
	* Creates a new Html instance and initializes it with head and body elements.
	*/
	constructor() {
		super("html");
		this.#head.append(() => this.#stylesheet.length ? this.#stylesheet : void 0);
		this.append(this.#head, this.#body);
	}
	/**
	* Configures the <head> element using a setter function.
	* @param setter A function that receives the head Dom instance.
	* @returns The current Html instance for chaining.
	*/
	head(setter) {
		setter(this.#head);
		return this;
	}
	/**
	* Configures the <body> element using a setter function.
	* @param setter A function that receives the body Dom instance.
	* @returns The current Html instance for chaining.
	*/
	body(setter) {
		setter(this.#body);
		return this;
	}
	/**
	* Adds a stylesheet rule to the document's head.
	* @param selector The CSS selector for the rule.
	* @param setter A function that receives a StyleRules instance or a record of style properties.
	* @returns The current Html instance for chaining.
	*/
	stylesheet(selector, setter) {
		this.#stylesheet.stylesheet(selector, setter);
		return this;
	}
	/**
	* Returns the string representation of the full HTML document,
	* including the DOCTYPE declaration.
	* @returns The complete HTML document string.
	*/
	toString() {
		return "<!DOCTYPE html>\n" + super.toString();
	}
};
//#endregion
//#region src/createHtml.ts
/**
* Factory function to create and configure a new Html document instance.
* @param options The options for the document.
* @returns A new, configured Html instance.
*/
function createHtml(options) {
	const html = new Html();
	const lang = options?.lang ?? "en";
	if (lang) html.attribute("lang", lang);
	const charset = options?.charset ?? "utf-8";
	if (charset) {
		const meta = createElement("meta").attribute("charset", charset);
		html.head((h) => h.append(meta));
	}
	if (options?.mobileMeta ?? true) {
		const meta = createElement("meta").attribute("name", "viewport").attribute("content", "width=device-width, initial-scale=1.0");
		html.head((h) => h.append(meta));
	}
	if (options?.title) {
		const title = createElement("title").append(options.title);
		html.head((h) => h.append(title));
	}
	if (options?.base?.target || options?.base?.url) {
		const base = createElement("base").attribute("target", options.base.target).attribute("url", options.base.url);
		html.head((h) => h.append(base));
	}
	return html;
}
//#endregion
//#region src/createScript.ts
/**
* Creates a <script> element containing an immediately invoked function expression (IIFE).
* @param func The function to be executed in the script.
* @param data The arguments to be passed to the function (must be JSON-serializable).
* @returns A Dom instance representing the <script> element.
*/
function createScript(func, ...data) {
	const args = data.map((a) => JSON.stringify(a)).join(", ");
	return createElement("script").append(`(${func.toString()})(${args});`);
}
//#endregion
export { StyleUtils, createElement, createHtml, createScript };
