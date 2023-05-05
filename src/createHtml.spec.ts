import { createHtml } from './createHtml';
import { Tester } from './test';

export function createHtmlTests(test: Tester) {
  test(
    createHtml(),
    doc(
      '<html lang="en"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head><body></body></html>',
    ),
  );
  test(
    createHtml({
      lang: '',
    }),
    doc(
      '<html><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head><body></body></html>',
    ),
  );
  test(
    createHtml({
      lang: 'jp',
    }),
    doc(
      '<html lang="jp"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head><body></body></html>',
    ),
  );
  test(
    createHtml({
      mobileMeta: false,
    }),
    doc('<html lang="en"><head><meta charset="utf-8"></meta></head><body></body></html>'),
  );
  test(
    createHtml({
      charset: '',
    }),
    doc(
      '<html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head><body></body></html>',
    ),
  );
  test(
    createHtml({
      charset: 'utf-16',
    }),
    doc(
      '<html lang="en"><head><meta charset="utf-16"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head><body></body></html>',
    ),
  );
  test(
    createHtml({
      title: 'foo',
    }),
    doc(
      '<html lang="en"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta><title>foo</title></head><body></body></html>',
    ),
  );
  test(
    createHtml({
      title: '',
    }),
    doc(
      '<html lang="en"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head><body></body></html>',
    ),
  );
  test(
    createHtml({
      base: {},
    }),
    doc(
      '<html lang="en"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head><body></body></html>',
    ),
  );
  test(
    createHtml({
      base: {
        url: '',
        target: '',
      },
    }),
    doc(
      '<html lang="en"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head><body></body></html>',
    ),
  );
  test(
    createHtml({
      base: {
        url: 'https://foo.com',
      },
    }),
    doc(
      '<html lang="en"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta><base url="https://foo.com"></base></head><body></body></html>',
    ),
  );
  test(
    createHtml({
      base: {
        target: '_blank',
      },
    }),
    doc(
      '<html lang="en"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta><base target="_blank"></base></head><body></body></html>',
    ),
  );
  test(
    createHtml({
      base: {
        url: 'https://foo.com',
        target: '_blank',
      },
    }),
    doc(
      '<html lang="en"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta><base target="_blank" url="https://foo.com"></base></head><body></body></html>',
    ),
  );
}

function doc(input: string): string {
  return `<!DOCTYPE html>\n${input}`;
}
