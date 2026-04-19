import { GenStack } from '@wormss/genstack';

type AngleUnits = `${number}deg` | `${number}turn` | `${number}grad` | `${number}rad`;
type SideOrCorner =
  | `to ${'left' | 'right' | 'bottom' | 'top'}`
  | `to ${'left' | 'right'} ${'top' | 'bottom'}`;

type LinearGradiantDir = SideOrCorner | AngleUnits;

/**
 * Utility functions for generating CSS values and structures.
 */
export const StyleUtils = {
  /**
   * Generates a CSS linear-gradient string.
   * @param dir The direction of the gradient (e.g., 'to right', '45deg').
   * @param values The color stop values for the gradient.
   * @returns A linear-gradient CSS string, or an empty string if no colors are provided.
   */
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

  /**
   * Joins a list of values into a comma-separated string.
   * @param values The values to join.
   * @returns A comma-separated string, or undefined if no valid values are provided.
   */
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

  /**
   * Generates a CSS rgb() or rgba() color string.
   * @param r The red component (0-255).
   * @param g The green component (0-255).
   * @param b The blue component (0-255).
   * @param a The optional alpha (transparency) component (0-1).
   * @returns An rgb or rgba CSS string.
   */
  rgb(r: number, g: number, b: number, a?: number): string {
    return `rgb(${GenStack.from([r, g, b, a]).filterUndefined().toArray().join(', ')})`;
  },

  /**
   * Generates a CSS hsl() color string.
   * @param hue The hue value (number for turns, or a string with units).
   * @param saturation The saturation percentage (0-100).
   * @param lightness The lightness percentage (0-100).
   * @param alpha The optional alpha (transparency) component (0-1).
   * @returns An hsl CSS string.
   */
  hsl(hue: number | AngleUnits, saturation: number, lightness: number, alpha?: number): string {
    const hueStr = typeof hue === 'string' ? hue : `${hue}turn`;
    const alphaStr = typeof alpha === 'number' ? `/ ${alpha}` : '';
    return `hsl(${hueStr}, ${saturation}%, ${lightness}%${alphaStr})`;
  },

  /**
   * Wraps a string in a CSS url() function.
   * @param url The URL string.
   * @returns A url() CSS string.
   */
  url(url: string): string {
    return `url('${url}')`;
  },
} as const;
