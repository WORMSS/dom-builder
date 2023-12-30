import { expect, describe, it } from 'vitest';
import { StyleUtils } from './index';

describe('StyleUtils', () => {
  describe(StyleUtils.linearGradiant.name, () => {
    it('should return a valid linearGradiant', () => {
      expect(StyleUtils.linearGradiant('to bottom', 'green', 'blue')).toBe(
        'linear-gradient(to bottom, green, blue)',
      );
    });
    it('should return blank with no valid values', () => {
      expect(StyleUtils.linearGradiant('to bottom')).toBe('');
      expect(StyleUtils.linearGradiant('to bottom', undefined)).toBe('');
      expect(StyleUtils.linearGradiant('to bottom', '')).toBe('');
      expect(StyleUtils.linearGradiant('to bottom', ' ')).toBe('');
      expect(StyleUtils.linearGradiant('to bottom', '\n')).toBe('');
    });
  });
  describe(StyleUtils.list.name, () => {
    it('should return a valid list', () => {
      expect(StyleUtils.list('green', 'blue')).toBe('green, blue');
    });
    it('should return undefined with no valid values', () => {
      expect(StyleUtils.list()).toBeUndefined();
      expect(StyleUtils.list(undefined, undefined)).toBeUndefined();
      expect(StyleUtils.list('', '')).toBeUndefined();
      expect(StyleUtils.list(' ', ' ')).toBeUndefined();
      expect(StyleUtils.list('\n', '\n')).toBeUndefined();
    });
  });
  describe(StyleUtils.rgb.name, () => {
    it('should return rgb value', () => {
      expect(StyleUtils.rgb(123, 123, 123)).toBe('rgb(123, 123, 123)');
      expect(StyleUtils.rgb(123, 123, 123, undefined)).toBe('rgb(123, 123, 123)');
    });
    it('should return rgba value', () => {
      expect(StyleUtils.rgb(123, 123, 123, 123)).toBe('rgb(123, 123, 123, 123)');
    });
  });
  describe(StyleUtils.url.name, () => {
    it('should return value wrapped in url', () => {
      expect(StyleUtils.url('a.html')).toBe(`url('a.html')`);
    });
  });
});
