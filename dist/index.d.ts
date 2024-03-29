type StyleRules = Record<Exclude<keyof CSSStyleDeclaration, 'getPropertyPriority' | 'getPropertyValue' | 'item' | 'removeProperty' | 'setProperty' | 'parentRule' | 'length' | `webkit${string}` | number | symbol>, (value: string | undefined) => StyleRules> & {
    [Symbol.iterator](): IterableIterator<string>;
    readonly length: number;
    setProperty(name: string, value: string | undefined): StyleRules;
    new (): StyleRules;
    utils: typeof utils;
};
declare const StyleRules: StyleRules;
type AngleUnits = `${number}deg` | `${number}turn` | `${number}grad` | `${number}rad`;
type SideOrCorner = `to ${'left' | 'right' | 'bottom' | 'top'}` | `to ${'left' | 'right'} ${'top' | 'bottom'}`;
type LinearGradiantDir = SideOrCorner | AngleUnits;
declare const utils: {
    linearGradiant(dir: LinearGradiantDir, ...values: (string | undefined)[]): string;
    list(...values: (string | undefined)[]): string | undefined;
    rgb(r: number, g: number, b: number, a?: number): string;
    url(url: string): string;
};

declare class Dom {
    #private;
    constructor(tagname: string);
    append(...children: (Dom | string | undefined)[]): this;
    attribute(name: string, value: string | undefined): this;
    class(value: string | undefined): this;
    style(setter: (style: StyleRules) => void): this;
    use(setter: (dom: this) => void): this;
    toString(): string;
    protected toStringTagOpener(): string;
    protected toStringChildren(): string;
}

declare function createElement(tagname: string): Dom;

declare class Html extends Dom {
    #private;
    constructor();
    head(setter: (head: Dom) => void): this;
    body(setter: (body: Dom) => void): this;
    stylesheet(selector: string, setter: (style: StyleRules) => void): this;
    toString(): string;
}

declare function createHtml(options?: {
    title?: string;
    /**
     * @default en
     */
    lang?: string;
    /**
     * @default true
     */
    mobileMeta?: boolean;
    /**
     * @default utf-8
     */
    charset?: string;
    base?: {
        url?: string;
        target?: string;
    };
}): Html;

type Json = string | number | boolean | null | Json[] | {
    [key: string]: Json;
};
declare function createScript<T extends Json[]>(func: (...args: T) => void, ...data: T): Dom;

export { Dom, Html, StyleRules, createElement, createHtml, createScript };
