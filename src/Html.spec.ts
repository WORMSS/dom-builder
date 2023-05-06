import { Html } from './Html';
import { Tester } from './test';

export function HtmlTests(test: Tester) {
  test(new Html(), doc('<html><head></head><body></body></html>'));
  test(
    new Html().head((h) => h.append('foo')),
    doc('<html><head>foo</head><body></body></html>'),
  );
  test(
    new Html().head((h) => h.append('foo')).head((h) => h.append('bar')),
    doc('<html><head>foobar</head><body></body></html>'),
  );
  test(
    new Html().body((b) => b.append('foo')),
    doc('<html><head></head><body>foo</body></html>'),
  );
  test(
    new Html().body((b) => b.append('foo')).body((b) => b.append('bar')),
    doc('<html><head></head><body>foobar</body></html>'),
  );
  test(
    new Html().stylesheet('body', (s) => s.color('green')),
    doc('<html><head><style>body { color: green; }</style></head><body></body></html>'),
  );
  test(
    new Html()
      .stylesheet('body', (s) => s.color('green'))
      .stylesheet('html', (s) => s.background('blue')),
    doc(
      '<html><head><style>body { color: green; } html { background: blue; }</style></head><body></body></html>',
    ),
  );
  test(
    new Html().use((h) => h.stylesheet('a', (s) => s.color('green'))),
    doc('<html><head><style>a { color: green; }</style></head><body></body></html>'),
  );
}

function doc(input: string): string {
  return `<!DOCTYPE html>\n${input}`;
}
