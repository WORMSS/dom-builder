import { Html } from './Html';
import { expect, describe, it } from 'vitest';

describe(Html.name, () => {
  it('should should add head and body by default', () => {
    expect(new Html().toString()).toBe(doc('<html><head></head><body></body></html>'));
  });

  describe(Html.prototype.head.name, () => {
    it('should give access to the head dom node', () => {
      expect(new Html().head((h) => h.append('foo')).toString()).toBe(
        doc('<html><head>foo</head><body></body></html>'),
      );
    });

    it('should be safe to call head multiple times', () => {
      expect(
        new Html()
          .head((h) => h.append('foo'))
          .head((h) => h.append('bar'))
          .toString(),
      ).toBe(doc('<html><head>foobar</head><body></body></html>'));
    });
  });

  describe(Html.prototype.body.name, () => {
    it('should give access to the body dom node', () => {
      expect(new Html().body((b) => b.append('foo')).toString()).toBe(
        doc('<html><head></head><body>foo</body></html>'),
      );
    });

    it('should be safe to call body multiple times', () => {
      expect(
        new Html()
          .body((b) => b.append('foo'))
          .body((b) => b.append('bar'))
          .toString(),
      ).toBe(doc('<html><head></head><body>foobar</body></html>'));
    });
  });

  describe(Html.prototype.stylesheet.name, () => {
    it('should add a style element to the head', () => {
      expect(new Html().stylesheet('body', (s) => s.color('green')).toString()).toBe(
        doc('<html><head><style>body { color: green; }</style></head><body></body></html>'),
      );
    });

    it('should add a single style element on multiple calls', () => {
      expect(
        new Html()
          .stylesheet('body', (s) => s.color('green'))
          .stylesheet('html', (s) => s.background('blue'))
          .toString(),
      ).toBe(
        doc(
          '<html><head><style>body { color: green; } html { background: blue; }</style></head><body></body></html>',
        ),
      );
    });
  });

  describe(Html.prototype.use.name, () => {
    it('should allow access to the html dom node for middleware', () => {
      expect(new Html().use((h) => h.stylesheet('a', (s) => s.color('green'))).toString()).toBe(
        doc('<html><head><style>a { color: green; }</style></head><body></body></html>'),
      );
    });
  });
});

function doc(input: string): string {
  return `<!DOCTYPE html>\n${input}`;
}
