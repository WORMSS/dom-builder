import { GenStack } from '@wormss/genstack';
import { paramCase } from 'param-case';

export type StyleRules = Record<
  Exclude<
    keyof CSSStyleDeclaration,
    | 'getPropertyPriority'
    | 'getPropertyValue'
    | 'item'
    | 'removeProperty'
    | 'setProperty'
    | 'parentRule'
    | 'length'
    | `webkit${string}` // remove a bunch of webkit
    | number
    | symbol
  >,
  (value: string | undefined) => StyleRules
> & {
  [Symbol.iterator](): IterableIterator<string>;
  readonly length: number;
  setProperty(name: string, value: string | undefined): StyleRules;
  new (): StyleRules;
  utils: typeof utils;
};

export const StyleRules = new Proxy(function StyleRules() {} as unknown as StyleRules, {
  construct(target) {
    const map = new Map<string, string>();
    return new Proxy(new target(), {
      get(target, prop, me) {
        if (typeof prop === 'symbol')
          switch (prop) {
            case Symbol.iterator:
              return () => GenStack.from(map.entries()).map(([k, v]) => `${k}: ${v};`);
            case Symbol.toStringTag:
              return target.name;
            default:
              return Reflect.get(target, prop);
          }
        switch (prop) {
          case 'toString':
            return () => [...me].join(' ');
          case 'length':
            return map.size;
          case 'setProperty':
            return (name: string, value: string | undefined) => {
              value = value?.trim();
              if (value) map.set(name, value);
              return me;
            };
          case 'utils':
            return utils;
          default:
            return (value: string | undefined) => {
              value = value?.trim();
              if (value) map.set(paramCase(prop), value);
              return me;
            };
        }
      },
    });
  },
});

type AngleUnits = `${number}deg` | `${number}turn` | `${number}grad` | `${number}rad`;
type SideOrCorner =
  | `to ${'left' | 'right' | 'bottom' | 'top'}`
  | `to ${'left' | 'right'} ${'top' | 'bottom'}`;

type LinearGradiantDir = SideOrCorner | AngleUnits;

const utils = {
  linearGradiant(dir: LinearGradiantDir, ...values: (string | undefined)[]): string {
    const colours = GenStack.from(values)
      .filterUndefined()
      .map((s) => s.trim())
      .filter((s) => !!s)
      .toArray()
      .join(', ');
    if (!colours) return '';
    return `linear-gradient(${dir}, ${colours})`;
  },
  list(...values: (string | undefined)[]): string | undefined {
    const list = GenStack.from(values)
      .filterUndefined()
      .map((s) => s.trim())
      .filter((s) => !!s)
      .toArray()
      .join(', ');
    if (!list) return undefined;
    return list;
  },
  rgb(r: number, g: number, b: number, a?: number): string {
    return `rgb(${GenStack.from([r, g, b, a]).filterUndefined().toArray().join(', ')})`;
  },
  url(url: string): string {
    return `url('${url}')`;
  },
};
