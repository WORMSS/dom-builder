import { Dom } from './Dom';
import type { StyleRulesKeys } from './StyleRules';
import { StyleRules } from './StyleRules';
import { Style } from './Style';
import { createElement } from './createElement';

/**
 * Represents the top-level HTML document structure.
 * Automatically includes <!DOCTYPE html> and <html>, <head>, and <body> tags.
 */
export class Html extends Dom {
  #head = createElement('head');
  #stylesheet = new Style();
  #body = createElement('body');

  /**
   * Creates a new Html instance and initializes it with head and body elements.
   */
  constructor() {
    super('html');
    this.#head.append(() => (this.#stylesheet.length ? this.#stylesheet : undefined));
    this.append(this.#head, this.#body);
  }

  /**
   * Configures the <head> element using a setter function.
   * @param setter A function that receives the head Dom instance.
   * @returns The current Html instance for chaining.
   */
  head(setter: (head: Dom) => void): this {
    setter(this.#head);
    return this;
  }

  /**
   * Configures the <body> element using a setter function.
   * @param setter A function that receives the body Dom instance.
   * @returns The current Html instance for chaining.
   */
  body(setter: (body: Dom) => void): this {
    setter(this.#body);
    return this;
  }

  /**
   * Adds a stylesheet rule to the document's head.
   * @param selector The CSS selector for the rule.
   * @param setter A function that receives a StyleRules instance or a record of style properties.
   * @returns The current Html instance for chaining.
   */
  stylesheet(
    selector: string,
    setter: ((style: StyleRules) => void) | Partial<Record<StyleRulesKeys, string | undefined>>,
  ): this {
    this.#stylesheet.stylesheet(selector, setter);
    return this;
  }

  /**
   * Returns the string representation of the full HTML document,
   * including the DOCTYPE declaration.
   * @returns The complete HTML document string.
   */
  override toString(): string {
    return '<!DOCTYPE html>\n' + super.toString();
  }
}
