import { Dom } from './Dom';
import { expect, describe, it } from 'vitest';

describe(Dom.name, () => {
  it('should create a empty element for known html tag', () => {
    expect(new Dom('a').toString()).toEqual('<a></a>');
  });

  it('should create a empty element for fake html tags', () => {
    expect(new Dom('fake').toString()).toEqual('<fake></fake>');
  });

  describe(Dom.prototype.class.name, () => {
    it('should add a class attribute to element', () => {
      expect(new Dom('a').class('test').toString()).toEqual('<a class="test"></a>');
    });

    it('should ignore undefined class names', () => {
      expect(new Dom('a').class(undefined).toString()).toEqual('<a></a>');
    });

    it('should add a single class attribute when multiple classes are added', () => {
      expect(new Dom('a').class('foo').class('bar').toString()).toEqual('<a class="foo bar"></a>');
    });

    it('should add a single class when class and undefined are added', () => {
      expect(new Dom('a').class('foo').class(undefined).toString()).toEqual('<a class="foo"></a>');
    });
  });

  describe(Dom.prototype.attribute.name, () => {
    it('should add a named attribute when value is blank string', () => {
      expect(new Dom('a').attribute('foo', '').toString()).toEqual('<a foo></a>');
    });

    it('should add a attribute and value when value is supplied', () => {
      expect(new Dom('a').attribute('foo', 'bar').toString()).toEqual('<a foo="bar"></a>');
    });

    it('should add multiple attributes', () => {
      expect(new Dom('a').attribute('foo', 'bar').attribute('bar', 'baz').toString()).toEqual(
        '<a foo="bar" bar="baz"></a>',
      );
    });

    it('should ignore attribute when value is undefined', () => {
      expect(new Dom('a').attribute('foo', undefined).toString()).toEqual('<a></a>');
    });
  });

  describe(Dom.prototype.style.name, () => {
    it('should add a single style attribute with values', () => {
      expect(new Dom('a').style((s) => s.color('green')).toString()).toEqual(
        '<a style="color: green;"></a>',
      );
    });

    it('should add a single style attribute with multiple values', () => {
      expect(new Dom('a').style((s) => s.color('green').background('blue')).toString()).toEqual(
        '<a style="color: green; background: blue;"></a>',
      );
    });

    it('should add a single style attribute when called twice with values', () => {
      expect(
        new Dom('a')
          .style((s) => s.color('green'))
          .style((s) => s.background('blue'))
          .toString(),
      ).toEqual('<a style="color: green; background: blue;"></a>');
    });

    it('should should not add style attribute when style had no valid values', () => {
      expect(new Dom('a').style((s) => s.color(undefined)).toString()).toEqual('<a></a>');
    });
  });

  describe(Dom.prototype.append.name, () => {
    it('should add a simple text string', () => {
      expect(new Dom('a').append('hello').toString()).toEqual('<a>hello</a>');
    });

    it('should add another Dom child', () => {
      expect(new Dom('a').append(new Dom('b')).toString()).toEqual('<a><b></b></a>');
    });

    it('should add multiple children of mixed type in different calls', () => {
      expect(new Dom('a').append(new Dom('b')).append('hello').toString()).toEqual(
        '<a><b></b>hello</a>',
      );
    });

    it('should add multiple children both Dom nodes in different calls', () => {
      expect(new Dom('a').append(new Dom('b')).append(new Dom('c')).toString()).toEqual(
        '<a><b></b><c></c></a>',
      );
    });

    it('should add multiple children both strings in different calls', () => {
      expect(new Dom('a').append('a').append('b').toString()).toEqual('<a>ab</a>');
    });

    it('should add multiple children of different types in same call', () => {
      expect(new Dom('a').append(new Dom('b'), 'hello').toString()).toEqual('<a><b></b>hello</a>');
    });

    it('should add multiple children of Dom nodes in same call', () => {
      expect(new Dom('a').append(new Dom('b'), new Dom('c')).toString()).toEqual(
        '<a><b></b><c></c></a>',
      );
    });

    it('should add multiple children both strings in same calls', () => {
      expect(new Dom('a').append('a', 'b').toString()).toEqual('<a>ab</a>');
    });
  });

  describe(Dom.prototype.use.name, () => {
    it('should allow use of middleware', () => {
      expect(new Dom('a').use((d) => d.style((s) => s.color('green'))).toString()).toEqual(
        '<a style="color: green;"></a>',
      );
    });
  });
});
