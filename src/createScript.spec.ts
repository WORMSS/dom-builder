import { createScript } from './index';
import { expect, describe, it } from 'vitest';

describe(createScript.name, () => {
  it('should create a blank function', () => {
    expect(createScript(function () {}).toString()).toEqual(
      '<script>(function() {\n    })();</script>',
    );
  });

  it('should create a blank arrow function', () => {
    expect(createScript(() => ({})).toString()).toEqual('<script>(() => ({}))();</script>');
  });

  describe('arguments', () => {
    it('should accept a string argument', () => {
      expect(createScript((a) => ({}), 'a').toString()).toEqual(
        '<script>((a) => ({}))("a");</script>',
      );
    });

    it('should accept a number argument', () => {
      expect(createScript((a) => ({}), 1).toString()).toEqual('<script>((a) => ({}))(1);</script>');
    });

    it('should accept a true boolean argument', () => {
      expect(createScript((a) => ({}), true).toString()).toEqual(
        '<script>((a) => ({}))(true);</script>',
      );
    });

    it('should accept a false boolean argument', () => {
      expect(createScript((a) => ({}), false).toString()).toEqual(
        '<script>((a) => ({}))(false);</script>',
      );
    });

    it('should accept an object argument', () => {
      expect(createScript((a) => ({}), {}).toString()).toEqual(
        '<script>((a) => ({}))({});</script>',
      );
    });

    it('should accept an object with string properties argument', () => {
      expect(createScript((a) => ({}), { a: 'a' }).toString()).toEqual(
        '<script>((a) => ({}))({"a":"a"});</script>',
      );
    });

    it('should accept an object with array of number properties argument', () => {
      expect(createScript((a) => ({}), { a: [1] }).toString()).toEqual(
        '<script>((a) => ({}))({"a":[1]});</script>',
      );
    });

    it('should accept an array argument', () => {
      expect(createScript((a) => ({}), []).toString()).toEqual(
        '<script>((a) => ({}))([]);</script>',
      );
    });

    it('should accept an array of numbers argument', () => {
      expect(createScript((a) => ({}), [1, 2, 3]).toString()).toEqual(
        '<script>((a) => ({}))([1,2,3]);</script>',
      );
    });

    it('should accept a null argument', () => {
      expect(createScript((a) => ({}), null).toString()).toEqual(
        '<script>((a) => ({}))(null);</script>',
      );
    });

    it('should accept multiple arguments', () => {
      expect(createScript((a, b) => ({}), 1, 2).toString()).toEqual(
        '<script>((a, b) => ({}))(1, 2);</script>',
      );
    });

    it('should have typescript stripped from output', () => {
      expect(createScript((a: number, b: number) => ({}), 1, 2).toString()).toEqual(
        '<script>((a, b) => ({}))(1, 2);</script>',
      );
    });
  });
});
