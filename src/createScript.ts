import { createElement } from './createElement.js';
import type { Dom } from './Dom.js';

/**
 * Primitive JSON-serializable types.
 */
type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/**
 * Creates a <script> element containing an immediately invoked function expression (IIFE).
 * @param func The function to be executed in the script.
 * @param data The arguments to be passed to the function (must be JSON-serializable).
 * @returns A Dom instance representing the <script> element.
 */
export function createScript<T extends Json[]>(func: (...args: T) => void, ...data: T): Dom {
  const args = data.map((a) => JSON.stringify(a)).join(', ');
  return createElement('script').append(`(${func.toString()})(${args});`);
}
