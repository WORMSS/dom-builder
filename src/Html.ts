import { Dom } from './Dom';
import { StyleRules } from './StyleRules';
import { Style } from './Style';
import { createElement } from './createElement';

export class Html extends Dom {
  #head = createElement('head');
  #stylesheet = new Style();
  #body = createElement('body');
  #usedStylesheet = false;

  constructor() {
    super('html');
    this.append(this.#head, this.#body);
  }

  head(setter: (head: Dom) => void): this {
    setter(this.#head);
    return this;
  }

  body(setter: (body: Dom) => void): this {
    setter(this.#body);
    return this;
  }

  stylesheet(selector: string, setter: (style: StyleRules) => void): this {
    this.#stylesheet.stylesheet(selector, setter);
    if (!this.#usedStylesheet) {
      this.#usedStylesheet = true;
      this.#head.append(this.#stylesheet);
    }
    return this;
  }

  override toString(): string {
    return '<!DOCTYPE html>\n' + super.toString();
  }
}
