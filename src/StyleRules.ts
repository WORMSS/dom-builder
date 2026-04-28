import { GenStack } from '@wormss/genstack';
import { kebabCase } from 'change-case';
import { StyleUtils } from './StyleUtils.js';

/**
 * Valid CSS property names derived from CSSStyleDeclaration.
 */
export type StyleRulesKeys = Exclude<
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
>;

/**
 * Interface representing a collection of CSS style rules with chainable methods
 * for every CSS property.
 */
export type StyleRules = Record<StyleRulesKeys, (value: string | undefined) => StyleRules> & {
  /**
   * Iterates over the CSS rules, yielding strings like "property: value;".
   */
  [Symbol.iterator](): IterableIterator<string>;

  /**
   * Returns the number of style rules defined.
   */
  readonly length: number;

  /**
   * Sets a custom CSS property.
   * @param name The CSS property name.
   * @param value The value for the property.
   * @returns The StyleRules instance for chaining.
   */
  setProperty(name: string, value: string | undefined): StyleRules;

  /**
   * Constructs a new StyleRules instance.
   */
  new (): StyleRules;

  /**
   * Provides access to style utility functions.
   */
  utils: typeof StyleUtils;
};

/**
 * A chainable API for defining CSS styles. Uses a Proxy to support all
 * standard CSS properties as method calls.
 */
export const StyleRules = new Proxy(function StyleRules() {} as unknown as StyleRules, {
  /**
   * Constructs a new Proxy-based StyleRules instance.
   */
  construct(target) {
    const map = new Map<string, string>();
    return new Proxy(new target(), {
      /**
       * Dynamically handles method calls for CSS properties and other built-in properties.
       */
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
            /**
             * Returns the string representation of all defined style rules.
             */
            return () => [...me].join(' ');
          case 'length':
            /**
             * Returns the number of defined style rules.
             */
            return map.size;
          case 'setProperty':
            /**
             * Sets a raw CSS property.
             */
            return (name: string, value: string | undefined) => {
              value = value?.trim();
              if (value) map.set(name, value);
              return me;
            };
          case 'utils':
            /**
             * Returns the StyleUtils utility class.
             */
            return StyleUtils;
          default:
            /**
             * Handles arbitrary CSS properties (converted to kebab-case).
             */
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
