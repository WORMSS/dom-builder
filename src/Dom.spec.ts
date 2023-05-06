import { Dom } from './Dom';
import { Tester } from './test';

export function DomTests(test: Tester) {
  test(new Dom('a'), '<a></a>');
  test(new Dom('fake'), '<fake></fake>');
  test(new Dom('a').class('test'), '<a class="test"></a>');
  test(new Dom('a').class(undefined), '<a></a>');
  test(new Dom('a').class('foo').class('bar'), '<a class="foo bar"></a>');
  test(new Dom('a').class('foo').class(undefined), '<a class="foo"></a>');
  test(new Dom('a').attribute('foo', ''), '<a foo></a>');
  test(new Dom('a').attribute('foo', 'bar'), '<a foo="bar"></a>');
  test(new Dom('a').attribute('foo', 'bar').attribute('bar', 'baz'), '<a foo="bar" bar="baz"></a>');
  test(new Dom('a').attribute('foo', undefined), '<a></a>');
  test(
    new Dom('a').style((s) => s.color('green')),
    '<a style="color: green;"></a>',
  );
  test(
    new Dom('a').style((s) => s.color('green').background('blue')),
    '<a style="color: green; background: blue;"></a>',
  );
  test(
    new Dom('a').style((s) => s.color('green')).style((s) => s.background('blue')),
    '<a style="color: green; background: blue;"></a>',
  );
  test(
    new Dom('a').style((s) => s.color(undefined)),
    '<a></a>',
  );
  test(new Dom('a').append('hello'), '<a>hello</a>');
  test(new Dom('a').append(new Dom('b')), '<a><b></b></a>');
  test(new Dom('a').append(new Dom('b')).append('hello'), '<a><b></b>hello</a>');
  test(new Dom('a').append(new Dom('b')).append(new Dom('c')), '<a><b></b><c></c></a>');
  test(new Dom('a').append(new Dom('b'), 'hello'), '<a><b></b>hello</a>');
  test(new Dom('a').append(new Dom('b'), new Dom('c')), '<a><b></b><c></c></a>');
  test(
    new Dom('a').use((d) => d.style((s) => s.color('green'))),
    '<a style="color: green;"></a>',
  );
}
