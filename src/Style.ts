import { Dom } from './Dom';
import type { StyleRulesKeys } from './StyleRules';
import { StyleRules } from './StyleRules';
import { GenStack } from '@wormss/genstack';

type SetterEntry = [key: StyleRulesKeys, value: string | undefined];

/**
 * Represents a <style> element that manages a collection of CSS rules.
 */
export class Style extends Dom {
  #stylesheets = new Map<string, StyleRules>();

  /**
   * Creates a new Style instance (a <style> tag).
   */
  constructor() {
    super('style');
  }

  /**
   * Adds or updates a CSS rule in the stylesheet.
   * @param selector The CSS selector (e.g., 'body', '.my-class', '#my-id').
   * @param setter A function that receives a StyleRules instance or a record of style properties.
   * @returns The current Style instance for chaining.
   */
  stylesheet(
    selector: string,
    setter: ((style: StyleRules) => void) | Partial<Record<StyleRulesKeys, string | undefined>>,
  ): this {
    const style = new StyleRules();
    if (typeof setter === 'function') {
      setter(style);
    } else {
      for (const [key, value] of Object.entries(setter) as SetterEntry[]) {
        style[key](value); // Call a known StyleRule method.
      }
    }
    this.#stylesheets.set(selector, style);
    return this;
  }

  /**
   * Returns the number of stylesheet rules defined.
   */
  get length(): number {
    return this.#stylesheets.size;
  }

  /**
   * Generates the CSS string for all rules managed by this style element.
   * @returns The complete CSS string.
   */
  private toStringStylesheet(): string {
    return [
      ...GenStack.from(this.#stylesheets.entries())
        .filter(([_, style]) => style.length)
        .map(([key, style]) => `${key} { ${style.toString()} }`),
    ].join(' ');
  }

  /**
   * Combines children and the generated stylesheet string.
   * @returns The string representation of the style element's contents.
   */
  protected override toStringChildren(): string {
    return super.toStringChildren() + this.toStringStylesheet();
  }
}
