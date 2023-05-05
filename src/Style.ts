import { Dom } from './Dom';
import { StyleRules } from './StyleRules';
import { GenStack } from '@wormss/genstack';

export class Style extends Dom {
  #stylesheets = new Map<string, StyleRules>();

  constructor() {
    super('style');
  }

  stylesheet(selector: string, setter: (style: StyleRules) => void): this {
    const style = new StyleRules();
    setter(style);
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
