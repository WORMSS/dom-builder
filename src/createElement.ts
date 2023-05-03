import { Dom } from './Dom';

export function createElement(tagname: string): Dom {
  return new Dom(tagname);
}
