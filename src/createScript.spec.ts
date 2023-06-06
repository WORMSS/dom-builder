import { createScript } from './createScript';
import { Tester } from './test';

export function createScriptTests(test: Tester) {
  test(
    createScript(function () {}),
    `<script>(function() {
    })();</script>`,
  );
  test(
    createScript(() => ({})),
    `<script>(() => ({}))();</script>`,
  );
  test(
    createScript((a) => ({}), 'a'),
    `<script>((a) => ({}))("a");</script>`,
  );
  test(
    createScript((a) => ({}), 1),
    `<script>((a) => ({}))(1);</script>`,
  );
  test(
    createScript((a) => ({}), true),
    `<script>((a) => ({}))(true);</script>`,
  );
  test(
    createScript((a) => ({}), false),
    `<script>((a) => ({}))(false);</script>`,
  );
  test(
    createScript((a) => ({}), {}),
    `<script>((a) => ({}))({});</script>`,
  );
  test(
    createScript((a) => ({}), { a: 'a' }),
    `<script>((a) => ({}))({"a":"a"});</script>`,
  );
  test(
    createScript((a) => ({}), { a: [1] }),
    `<script>((a) => ({}))({"a":[1]});</script>`,
  );
  test(
    createScript((a) => ({}), []),
    `<script>((a) => ({}))([]);</script>`,
  );
  test(
    createScript((a) => ({}), [1, 2, 3]),
    `<script>((a) => ({}))([1,2,3]);</script>`,
  );
  test(
    createScript((a) => ({}), null),
    `<script>((a) => ({}))(null);</script>`,
  );
  test(
    createScript((a: number, b: number) => ({}), 1, 2),
    `<script>((a, b) => ({}))(1, 2);</script>`,
  );
}
