import { GenStack } from '@wormss/genstack';
import { kebabCase } from 'change-case';
import { StyleUtils } from './StyleUtils';

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
  utils: typeof StyleUtils;
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
            return StyleUtils;
          default:
            return (value: string | undefined) => {
              value = value?.trim();
              if (value) map.set(kebabCase(prop), value);
              return me;
            };
        }
      },
    });
  },
});
