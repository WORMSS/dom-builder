import { GenStack } from '@wormss/genstack';
import { paramCase } from 'change-case';

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
            return (name: string, value: string) => {
              if (value) map.set(name, value);
              return me;
            };
          case 'utils':
            return utils;
          default:
            return (value: string) => {
              if (value) map.set(paramCase(prop), value);
              return me;
            };
        }
      },
    });
  },
});

type LinearGradiantDir =
  | `to ${'left' | 'right' | 'bottom' | 'top'}`
  | `to ${'left' | 'right'} ${'top' | 'bottom'}`
  | `${number}deg`
  | `${number}turn`;

const utils = {
  linearGradiant(dir: LinearGradiantDir, ...values: string[]): string {
    return `linear-gradient(${dir}, ${values.join(', ')})`;
  },
};
