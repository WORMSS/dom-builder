import { GenStack } from '@wormss/genstack';
import { StyleRules } from './StyleRules.js';

/**
 * Represents a DOM element and provides a chainable API for building its structure,
 * attributes, classes, and styles.
 */
export class Dom {
  #tagname: string;
  #children: (Dom | string | (() => string | Dom | undefined | null))[] = [];
  #attributes: Map<string, string | (() => string | undefined)> = new Map();
  #classList: Set<string | (() => string | undefined)> = new Set();
  #style = new StyleRules();

  /**
   * Creates a new Dom instance with the specified tag name.
   * @param tagname The HTML tag name for this element.
   */
  constructor(tagname: string) {
    this.#tagname = tagname;
  }

  /**
   * Appends children to this element. Children can be other Dom instances,
   * strings, or functions that return a string or Dom instance.
   * @param children The children to append.
   * @returns The current Dom instance for chaining.
   */
  append(
    ...children: (Dom | string | (() => string | Dom | undefined | null) | undefined | null)[]
  ): this {
    this.#children.push(...GenStack.from(children).filterNullUndefined());
    return this;
  }

  /**
   * Adds an attribute or multiple attributes to the element.
   * @param attributes A record of attribute names and values. Values can be strings or functions that return a string.
   * @returns The current Dom instance for chaining.
   */
  attribute(
    attributes: Record<string, string | (() => string | undefined) | undefined>,
  ): this;
  /**
   * Adds an attribute to the element.
   * @param name The name of the attribute.
   * @param value The value of the attribute. If undefined, the attribute is ignored. Can be a string or a function that returns a string.
   * @returns The current Dom instance for chaining.
   */
  attribute(name: string, value: string | (() => string | undefined) | undefined): this;
  attribute(
    nameOrAttributes: string | Record<string, string | (() => string | undefined) | undefined>,
    value?: string | (() => string | undefined) | undefined,
  ): this {
    if (typeof nameOrAttributes === 'string') {
      const name = nameOrAttributes;
      if (value === undefined) return this;
      this.#attributes.set(name, value);
    } else {
      const attributes = nameOrAttributes;
      for (const [name, value] of Object.entries(attributes)) {
        if (value === undefined) {
          continue;
        }
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
  class(value: string | (() => string | undefined) | undefined): this {
    if (typeof value === 'function') {
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
  style(setter: (style: StyleRules) => void): this {
    setter(this.#style);
    return this;
  }

  /**
   * Allows using a middleware or a custom function to configure the current Dom instance.
   * @param setter A function that receives the current Dom instance.
   * @returns The current Dom instance for chaining.
   */
  use(setter: (dom: this) => void): this {
    setter(this);
    return this;
  }

  /**
   * Returns the string representation of the DOM element, including its tag,
   * attributes, classes, styles, and children.
   * @returns The HTML string.
   */
  toString(): string {
    const children = this.toStringChildren();
    const tagOpener = this.toStringTagOpener();

    return `<${tagOpener}>${children}</${this.#tagname}>`;
  }

  /**
   * Generates the opening tag string including attributes, classes, and styles.
   * @returns The opening tag string (without brackets).
   */
  protected toStringTagOpener(): string {
    const tagOpener = [
      this.#tagname,
      ...GenStack.from(this.#attributes.entries())
        .map(([k, v]) => {
          const val = typeof v === 'function' ? v() : v;
          if (val === undefined) return undefined;
          return val === '' ? k : `${k}="${val}"`;
        })
        .filterNullUndefined(),
    ];
    if (this.#classList.size) {
      const classes = GenStack.from(this.#classList)
        .map((c) => (typeof c === 'function' ? c() : c))
        .filterNullUndefined()
        .map((c) => c.trim())
        .filter((c) => c.length > 0)
        .toArray();
      if (classes.length) {
        tagOpener.push(`class="${classes.join(' ')}"`);
      }
    }
    if (this.#style.length) {
      tagOpener.push(`style="${this.#style.toString()}"`);
    }
    return tagOpener.join(' ');
  }

  /**
   * Generates the string representation of all children.
   * @returns The combined string of all children.
   */
  protected toStringChildren(): string {
    return this.#children
      .map((c) => {
        if (typeof c === 'function') {
          return c()?.toString() ?? '';
        } else {
          return c.toString();
        }
      })
      .join('');
  }
}
