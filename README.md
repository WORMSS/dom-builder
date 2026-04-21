# @wormss/dom-builder

A chainable, lightweight library for building DOM structures as strings. Perfect for server-side rendering when you want a clean, declarative API without the overhead of a full framework.

## Installation

```bash
npm install @wormss/dom-builder
```

## Basic Elements: `createElement`

The core of the library is `createElement`. It returns a `Dom` instance that you can chain to build your element.

### Simple Tag
```ts
import { createElement } from '@wormss/dom-builder';

createElement('div').toString();
// Output: <div></div>
```

### Attributes
Attributes can be added individually or as an object. `undefined` values are automatically ignored.

```ts
createElement('a')
  .attribute('href', 'https://github.com')
  .attribute('target', '_blank')
  .attribute('title', undefined) // Ignored
  .toString();
// Output: <a href="https://github.com" target="_blank"></a>

createElement('img')
  .attribute({
    src: 'logo.png',
    alt: 'Logo',
    loading: undefined // Ignored
  })
  .toString();
// Output: <img src="logo.png" alt="Logo"></img>
```

### Classes
Classes are added to a list. `undefined` or empty strings are ignored.

```ts
createElement('div')
  .class('container')
  .class('active')
  .class(undefined) // Ignored
  .toString();
// Output: <div class="container active"></div>
```

### Appending Children
You can append strings, other `Dom` instances, or deferred functions.

```ts
createElement('ul')
  .append(
    createElement('li').append('Item 1'),
    createElement('li').append('Item 2'),
    undefined // Ignored
  )
  .toString();
// Output: <ul><li>Item 1</li><li>Item 2</li></ul>
```

## Styling

The `.style()` method provides a typesafe, chainable API for CSS properties.

```ts
createElement('span')
  .style((s) => s
    .color('red')
    .fontWeight('bold')
    .fontSize('1.2rem')
    .marginTop(undefined) // Ignored
  )
  .toString();
// Output: <span style="color: red; font-weight: bold; font-size: 1.2rem;"></span>
```

### Style Utilities
`StyleUtils` (available via `s.utils` inside the style callback) helps with complex CSS values.

```ts
createElement('div')
  .style((s) => s
    .backgroundImage(s.utils.url('bg.png'))
    .backgroundColor(s.utils.rgb(255, 0, 0, 0.5))
    .background(s.utils.linearGradiant('to right', 'red', 'blue'))
  )
  .toString();
// Output: <div style="background-image: url('bg.png'); background-color: rgb(255, 0, 0, 0.5); background: linear-gradient(to right, red, blue);"></div>
```

## Building Full Documents: `createHtml`

`createHtml` simplifies the creation of a full HTML5 document including the `<!DOCTYPE html>` declaration and standard `<head>` tags.

```ts
import { createHtml } from '@wormss/dom-builder';

const html = createHtml({
  title: 'My Page',
  lang: 'en',
  charset: 'utf-8',
  mobileMeta: true, // Adds viewport meta tag
  base: { url: '/app/', target: '_blank' }
})
.body((body) => body.append('Hello World'))
.toString();

// Output:
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>My Page</title>
//   <base target="_blank" url="/app/">
// </head>
// <body>Hello World</body>
// </html>
```

### Document Stylesheets
The `stylesheet` method adds a `<style>` block to the document's `<head>`. It is intelligent and will only render the `<style>` tag if at least one non-empty rule is added.

```ts
const html = createHtml()
  .stylesheet('body', (s) => s.margin('0').padding('0'))
  .stylesheet('.card', { display: 'flex', borderRadius: '8px' })
  .toString();

// Output:
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <style>body { margin: 0; padding: 0; } .card { display: flex; border-radius: 8px; }</style>
// </head>
// <body></body>
// </html>
```

## Client-Side Scripts: `createScript`

Easily inject client-side logic by passing a function and its arguments. The function is automatically wrapped in an IIFE.

```ts
import { createScript } from '@wormss/dom-builder';

const script = createScript((name, age) => {
  console.log(`Hello ${name}, you are ${age}`);
}, 'Alice', 30);

script.toString();
// Output: <script>(function (name, age) { console.log("Hello " + name + ", you are " + age); })("Alice", 30);</script>
```

## Deferred Values

You can pass functions to `append`, `attribute`, and `class` to defer value resolution until `.toString()` is called.

```ts
let count = 1;
const el = createElement('div')
  .class(() => count > 0 ? 'has-items' : undefined)
  .append(() => `Count: ${count}`);

el.toString(); // <div class="has-items">Count: 1</div>

count = 0;
el.toString(); // <div>Count: 0</div>
```

## Middleware: `use`

Use `.use()` to apply reusable configurations or plugins to an element.

```ts
const withBlueBackground = (dom: Dom) => dom.style((s) => s.backgroundColor('blue'));

createElement('div')
  .append('Content')
  .use(withBlueBackground)
  .toString();
// Output: <div style="background-color: blue;">Content</div>
```
