import { createElement } from './index';
import { expect, describe, it } from 'vitest';

describe(createElement.name, () => {
  it('should create an bare anchor attribute', () => {
    expect(createElement('a').toString()).toEqual('<a></a>');
  });
});
