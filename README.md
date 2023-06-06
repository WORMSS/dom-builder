# @wormss/dom-builder

Because sometimes I just want to do simple server side rendering and I like chains
Commonjs and ESM

```bash
npm i @wormss/dom-builder
```

## Example

```ts
import { createHtml, createElement } from '@wormss/dom-builder';

/** All Chainable */
const html = createHtml({
    /**
     * automatically attach a <title> element to the head element
     * default: no default
     */
    title: 'my title',
    /**
     * automatically set the lang attribute to <html>
     * default: value is 'en'
     */
    lang: 'jp',
    /**
     * automatically set a <meta name="viewport" content="width=device-width, initial-scale=1.0">
     * default: is true
     */
    mobuleMeta: false,
    /**
     * automatically set the charset <meta> tag. Blank means no charset.
     * default: is 'utf-8'
     */
    charset: '',
    /**
     * automatically set a <base> to change the default relative path location and target
     * default: no default
     */
    base: {
      url: 'google.com',
      target: '_blank',
    }
  })

  /**
   * get access to the head element
   * see createElement below
   */
  .head((headElement) => headElement.append(....))

  /**
   * get access to the body element
   * see createElement below
   */
  .body((bodyElement) => bodyElement.class(....))

  /**
   * creates a single <style> element with the given selector and style rules
   * see createElement.style below
   */
  .stylesheet('foo', (stylerules) => stylerules.color(...))

  /**
   * See createElement below
   */
  .append(...)
  .attribute(...)
  .class(...)
  .style(...)

  /**
   * I'l let you guess
   */
  .toString();


const anchor = createElement('a')
  /**
   * a list of strings or dom elements, similar to HtmlElement.append(...)
   * undefined is ignored.
   */
  .append("foo", createElement('bar'), ...)

  /**
   * a single attribute key and value, similar to HTMLElement.setAttribute(key, value)
   * undefined is ignored, empty string sets only the key
   */
  .attribute("data-foo", "value-bar")
  .attribute('data-bar', '')

  /**
   * a single value class value, similar to HTMLElement.classList.add(value)
   */
  .class('foo')

  /**
   * a stylerule setter callback, a chainable version of el.style;
   * el.style.color = 'green'; el.style.background = 'blue';
   */
  .style((stylerules) => stylerules.color('green').background('blue'))
  .style((stylerules) => stylerules.backgroundImage(
    /**
     * Small utility to write linearGradiants
     */
    s.utils.linearGradiant('to right', 'blue', 'green'),
  ))

  /**
   * I'l let you guess
   */
  .toString();

/**
 * Typesafe sugar for createElement('script').append((function (arg1, arg2))(arg1Value, arg2Value));
 */
const scriptDom = createScript(
  /**
   * The function, arguments are type safe.
   */
  (arg1, arg2) => ({}),
  /**
   * arg1's value, can be number, string, boolean, null, array or object
   */
  "a",
  /**
   * arg2's value, can be number, string, boolean, null, array or object
   */
  2
)
```

Legacy
```js
const { createHtml, createElement } = require('@wormss/decode-html');
```