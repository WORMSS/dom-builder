import { createElement } from './createElement';
import { Tester } from './test';

export function createElementTests(test: Tester) {
  test(createElement('a'), '<a></a>');
}
