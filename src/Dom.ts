import { StyleRules } from './StyleRules';
import { GenStack } from '@wormss/genstack';

export class Dom {
  #tagname: string;
  #children: (Dom | string)[] = [];
  #attributes: Map<string, string> = new Map();
  #classList: Set<string> = new Set();
  #style = new StyleRules();

  constructor(tagname: string) {
    this.#tagname = tagname;
  }

  append(...children: (Dom | string | undefined)[]): this {
    this.#children.push(...GenStack.from(children).filterUndefined());
    return this;
  }

  attribute(name: string, value: string | undefined): this {
    if (value === undefined) return this;
    this.#attributes.set(name, value);
    return this;
  }

  class(value: string): this {
    this.#classList.add(value);
    return this;
  }

  style(setter: (style: StyleRules) => void): this {
    setter(this.#style);
    return this;
  }

  toString(): string {
    const children = this.toStringChildren();
    const tagOpener = this.toStringTagOpener();

    return `<${tagOpener}>${children}</${this.#tagname}>`;
  }

  protected toStringTagOpener(): string {
    const tagOpener = [
      this.#tagname,
      ...GenStack.from(this.#attributes.entries()).map(([k, v]) => (v === '' ? k : `${k}="${v}"`)),
    ];
    if (this.#classList.size) {
      tagOpener.push(`class="${[...this.#classList].join(' ')}"`);
    }
    if (this.#style.length) {
      tagOpener.push(`style="${this.#style.toString()}"`);
    }
    return tagOpener.join(' ');
  }

  protected toStringChildren(): string {
    return this.#children.map((c) => c.toString()).join('');
  }
}
