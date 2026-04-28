import { Dom } from './Dom.js';

/**
 * Factory function to create a new Dom instance with the specified tag name.
 * @param tagname The HTML tag name for the element.
 * @returns A new Dom instance.
 */
export function createElement(tagname: string): Dom {
  return new Dom(tagname);
}
