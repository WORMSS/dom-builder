import { GenStack } from '@wormss/genstack';

type AngleUnits = `${number}deg` | `${number}turn` | `${number}grad` | `${number}rad`;
type SideOrCorner =
  | `to ${'left' | 'right' | 'bottom' | 'top'}`
  | `to ${'left' | 'right'} ${'top' | 'bottom'}`;

type LinearGradiantDir = SideOrCorner | AngleUnits;

export const StyleUtils = {
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
  hsl(hue: number | AngleUnits, saturation: number, lightness: number, alpha?: number): string {
    const hueStr = typeof hue === 'string' ? hue : `${hue}turn`;
    const alphaStr = typeof alpha === 'number' ? `/ ${alpha}` : '';
    return `hsl(${hueStr}, ${saturation}%, ${lightness}%${alphaStr})`;
  },
  url(url: string): string {
    return `url('${url}')`;
  },
} as const;
