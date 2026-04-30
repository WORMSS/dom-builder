import { describe, expect, it } from 'vitest';
import { createScript } from './index.js';

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
      // @ts-expect-error unused variable
      expect(createScript((a) => ({}), 'a').toString()).toEqual(
        '<script>((a) => ({}))("a");</script>',
      );
    });

    it('should accept a number argument', () => {
      // @ts-expect-error unused variable
      expect(createScript((a) => ({}), 1).toString()).toEqual('<script>((a) => ({}))(1);</script>');
    });

    it('should accept a true boolean argument', () => {
      // @ts-expect-error unused variable
      expect(createScript((a) => ({}), true).toString()).toEqual(
        '<script>((a) => ({}))(true);</script>',
      );
    });

    it('should accept a false boolean argument', () => {
      // @ts-expect-error unused variable
      expect(createScript((a) => ({}), false).toString()).toEqual(
        '<script>((a) => ({}))(false);</script>',
      );
    });

    it('should accept an object argument', () => {
      // @ts-expect-error unused variable
      expect(createScript((a) => ({}), {}).toString()).toEqual(
        '<script>((a) => ({}))({});</script>',
      );
    });

    it('should accept an object with string properties argument', () => {
      // @ts-expect-error unused variable
      expect(createScript((a) => ({}), { a: 'a' }).toString()).toEqual(
        '<script>((a) => ({}))({"a":"a"});</script>',
      );
    });

    it('should accept an object with array of number properties argument', () => {
      // @ts-expect-error unused variable
      expect(createScript((a) => ({}), { a: [1] }).toString()).toEqual(
        '<script>((a) => ({}))({"a":[1]});</script>',
      );
    });

    it('should accept an array argument', () => {
      // @ts-expect-error unused variable
      expect(createScript((a) => ({}), []).toString()).toEqual(
        '<script>((a) => ({}))([]);</script>',
      );
    });

    it('should accept an array of numbers argument', () => {
      // @ts-expect-error unused variable
      expect(createScript((a) => ({}), [1, 2, 3]).toString()).toEqual(
        '<script>((a) => ({}))([1,2,3]);</script>',
      );
    });

    it('should accept a null argument', () => {
      // @ts-expect-error unused variable
      expect(createScript((a) => ({}), null).toString()).toEqual(
        '<script>((a) => ({}))(null);</script>',
      );
    });

    it('should accept multiple arguments', () => {
      // @ts-expect-error unused variable
      expect(createScript((a, b) => ({}), 1, 2).toString()).toEqual(
        '<script>((a, b) => ({}))(1, 2);</script>',
      );
    });

    it('should have typescript stripped from output', () => {
      // @ts-expect-error unused variable
      expect(createScript((a: number, b: number) => ({}), 1, 2).toString()).toEqual(
        '<script>((a, b) => ({}))(1, 2);</script>',
      );
    });
  });
});
