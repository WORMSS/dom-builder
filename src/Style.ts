import { Dom } from './Dom';
import type { StyleRulesKeys } from './StyleRules';
import { StyleRules } from './StyleRules';
import { GenStack } from '@wormss/genstack';

type SetterEntry = [key: StyleRulesKeys, value: string | undefined];

export class Style extends Dom {
  #stylesheets = new Map<string, StyleRules>();

  constructor() {
    super('style');
  }

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

  get length(): number {
    return this.#stylesheets.size;
  }

  private toStringStylesheet(): string {
    return [
      ...GenStack.from(this.#stylesheets.entries())
        .filter(([_, style]) => style.length)
        .map(([key, style]) => `${key} { ${style.toString()} }`),
    ].join(' ');
  }

  protected override toStringChildren(): string {
    return super.toStringChildren() + this.toStringStylesheet();
  }
}
