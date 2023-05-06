"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  createElement: () => createElement,
  createHtml: () => createHtml
});
module.exports = __toCommonJS(src_exports);

// src/StyleRules.ts
var import_genstack = require("@wormss/genstack");
var import_change_case = require("change-case");
var StyleRules = new Proxy(function StyleRules2() {
}, {
  construct(target) {
    const map = /* @__PURE__ */ new Map();
    return new Proxy(new target(), {
      get(target2, prop, me) {
        if (typeof prop === "symbol")
          switch (prop) {
            case Symbol.iterator:
              return () => import_genstack.GenStack.from(map.entries()).map(([k, v]) => `${k}: ${v};`);
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
                map.set((0, import_change_case.paramCase)(prop), value);
              return me;
            };
        }
      }
    });
  }
});
var utils = {
  linearGradiant(dir, ...values) {
    const colours = import_genstack.GenStack.from(values).filterUndefined().map((s) => s.trim()).filter((s) => !!s).toArray().join(", ");
    if (!colours)
      return "";
    return `linear-gradient(${dir}, ${values.join(", ")})`;
  }
};

// src/Dom.ts
var import_genstack2 = require("@wormss/genstack");
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
    this.#children.push(...import_genstack2.GenStack.from(children).filterUndefined());
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
      ...import_genstack2.GenStack.from(this.#attributes.entries()).map(([k, v]) => v === "" ? k : `${k}="${v}"`)
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
var import_genstack3 = require("@wormss/genstack");
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
      ...import_genstack3.GenStack.from(this.#stylesheets.entries()).filter(([_, style]) => style.length).map(([key, style]) => `${key} { ${style.toString()} }`)
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createElement,
  createHtml
});
