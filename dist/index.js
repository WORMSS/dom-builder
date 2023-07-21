// src/StyleRules.ts
import { GenStack } from "@wormss/genstack";
import { paramCase } from "param-case";
var StyleRules = new Proxy(function StyleRules2() {
}, {
  construct(target) {
    const map = /* @__PURE__ */ new Map();
    return new Proxy(new target(), {
      get(target2, prop, me) {
        if (typeof prop === "symbol")
          switch (prop) {
            case Symbol.iterator:
              return () => GenStack.from(map.entries()).map(([k, v]) => `${k}: ${v};`);
            case Symbol.toStringTag:
              return target2.name;
            default:
              return Reflect.get(target2, prop);
          }
        switch (prop) {
          case "toString":
            return () => [...me].join(" ");
          case "length":
            return map.size;
          case "setProperty":
            return (name, value) => {
              value = value?.trim();
              if (value)
                map.set(name, value);
              return me;
            };
          case "utils":
            return utils;
          default:
            return (value) => {
              value = value?.trim();
              if (value)
                map.set(paramCase(prop), value);
              return me;
            };
        }
      }
    });
  }
});
var utils = {
  linearGradiant(dir, ...values) {
    const colours = GenStack.from(values).filterUndefined().map((s) => s.trim()).filter((s) => !!s).toArray().join(", ");
    if (!colours)
      return "";
    return `linear-gradient(${dir}, ${values.join(", ")})`;
  },
  rgb(r, g, b, a) {
    return `rgb(${GenStack.from([r, g, b, a]).filterUndefined().toArray().join(", ")})`;
  },
  url(url) {
    return `url('${url}')`;
  }
};

// src/Dom.ts
import { GenStack as GenStack2 } from "@wormss/genstack";
var Dom = class {
  #tagname;
  #children = [];
  #attributes = /* @__PURE__ */ new Map();
  #classList = /* @__PURE__ */ new Set();
  #style = new StyleRules();
  constructor(tagname) {
    this.#tagname = tagname;
  }
  append(...children) {
    this.#children.push(...GenStack2.from(children).filterUndefined());
    return this;
  }
  attribute(name, value) {
    if (value === void 0)
      return this;
    this.#attributes.set(name, value);
    return this;
  }
  class(value) {
    value = value?.trim();
    if (value)
      this.#classList.add(value);
    return this;
  }
  style(setter) {
    setter(this.#style);
    return this;
  }
  use(setter) {
    setter(this);
    return this;
  }
  toString() {
    const children = this.toStringChildren();
    const tagOpener = this.toStringTagOpener();
    return `<${tagOpener}>${children}</${this.#tagname}>`;
  }
  toStringTagOpener() {
    const tagOpener = [
      this.#tagname,
      ...GenStack2.from(this.#attributes.entries()).map(([k, v]) => v === "" ? k : `${k}="${v}"`)
    ];
    if (this.#classList.size) {
      tagOpener.push(`class="${[...this.#classList].join(" ")}"`);
    }
    if (this.#style.length) {
      tagOpener.push(`style="${this.#style.toString()}"`);
    }
    return tagOpener.join(" ");
  }
  toStringChildren() {
    return this.#children.map((c) => c.toString()).join("");
  }
};

// src/createElement.ts
function createElement(tagname) {
  return new Dom(tagname);
}

// src/Style.ts
import { GenStack as GenStack3 } from "@wormss/genstack";
var Style = class extends Dom {
  #stylesheets = /* @__PURE__ */ new Map();
  constructor() {
    super("style");
  }
  stylesheet(selector, setter) {
    const style = new StyleRules();
    setter(style);
    this.#stylesheets.set(selector, style);
    return this;
  }
  get length() {
    return this.#stylesheets.size;
  }
  toStringStylesheet() {
    return [
      ...GenStack3.from(this.#stylesheets.entries()).filter(([_, style]) => style.length).map(([key, style]) => `${key} { ${style.toString()} }`)
    ].join(" ");
  }
  toStringChildren() {
    return super.toStringChildren() + this.toStringStylesheet();
  }
};

// src/Html.ts
var Html = class extends Dom {
  #head = createElement("head");
  #stylesheet = new Style();
  #body = createElement("body");
  #usedStylesheet = false;
  constructor() {
    super("html");
    this.append(this.#head, this.#body);
  }
  head(setter) {
    setter(this.#head);
    return this;
  }
  body(setter) {
    setter(this.#body);
    return this;
  }
  stylesheet(selector, setter) {
    this.#stylesheet.stylesheet(selector, setter);
    if (!this.#usedStylesheet) {
      this.#usedStylesheet = true;
      this.#head.append(this.#stylesheet);
    }
    return this;
  }
  toString() {
    return "<!DOCTYPE html>\n" + super.toString();
  }
};

// src/createHtml.ts
function createHtml(options) {
  const html = new Html();
  const lang = options?.lang ?? "en";
  if (lang) {
    html.attribute("lang", lang);
  }
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

// src/createScript.ts
function createScript(func, ...data) {
  const args = data.map((a) => JSON.stringify(a)).join(", ");
  return createElement("script").append(`(${func.toString()})(${args});`);
}
export {
  createElement,
  createHtml,
  createScript
};
