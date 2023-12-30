import { createElement } from './index';
import type { Dom } from './Dom';

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export function createScript<T extends Json[]>(func: (...args: T) => void, ...data: T): Dom {
  const args = data.map((a) => JSON.stringify(a)).join(', ');
  return createElement('script').append(`(${func.toString()})(${args});`);
}
