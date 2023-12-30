import { createHtml } from './index';
import { expect, describe, it } from 'vitest';

describe(createHtml.name, () => {
  it('should create a default view', () => {
    expect(createHtml().toString()).toEqual(
      doc(
        '<html lang="en"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head><body></body></html>',
      ),
    );
  });

  it('should blank out default lang', () => {
    expect(
      createHtml({
        lang: '',
      }).toString(),
    ).toEqual(
      doc(
        '<html><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head><body></body></html>',
      ),
    );
  });

  it('should set lang to specified value', () => {
    expect(
      createHtml({
        lang: 'jp',
      }).toString(),
    ).toEqual(
      doc(
        '<html lang="jp"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head><body></body></html>',
      ),
    );
  });

  it('should disable default mobile meta tag', () => {
    expect(
      createHtml({
        mobileMeta: false,
      }).toString(),
    ).toEqual(
      doc('<html lang="en"><head><meta charset="utf-8"></meta></head><body></body></html>'),
    );
  });

  it('should blank out default charset', () => {
    expect(
      createHtml({
        charset: '',
      }).toString(),
    ).toEqual(
      doc(
        '<html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head><body></body></html>',
      ),
    );
  });

  it('should set charset to specified value', () => {
    expect(
      createHtml({
        charset: 'utf-16',
      }).toString(),
    ).toEqual(
      doc(
        '<html lang="en"><head><meta charset="utf-16"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head><body></body></html>',
      ),
    );
  });

  it('should create a title tag of specified value', () => {
    expect(
      createHtml({
        title: 'foo',
      }).toString(),
    ).toEqual(
      doc(
        '<html lang="en"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta><title>foo</title></head><body></body></html>',
      ),
    );
  });

  it('should ignore blank title value', () => {
    expect(
      createHtml({
        title: '',
      }).toString(),
    ).toEqual(
      doc(
        '<html lang="en"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head><body></body></html>',
      ),
    );
  });

  it('should leave base blank if no url or target supplied', () => {
    expect(
      createHtml({
        base: {},
      }).toString(),
    ).toEqual(
      doc(
        '<html lang="en"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head><body></body></html>',
      ),
    );
  });

  it('should leave base blank if url and target are blank values', () => {
    expect(
      createHtml({
        base: {
          url: '',
          target: '',
        },
      }).toString(),
    ).toEqual(
      doc(
        '<html lang="en"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head><body></body></html>',
      ),
    );
  });

  it('should create a base element with specified url', () => {
    expect(
      createHtml({
        base: {
          url: 'https://foo.com',
        },
      }).toString(),
    ).toEqual(
      doc(
        '<html lang="en"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta><base url="https://foo.com"></base></head><body></body></html>',
      ),
    );
  });

  it('should create a base element with specified target', () => {
    expect(
      createHtml({
        base: {
          target: '_blank',
        },
      }).toString(),
    ).toEqual(
      doc(
        '<html lang="en"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta><base target="_blank"></base></head><body></body></html>',
      ),
    );
  });

  it('should create a base element with specified url and target', () => {
    expect(
      createHtml({
        base: {
          url: 'https://foo.com',
          target: '_blank',
        },
      }).toString(),
    ).toEqual(
      doc(
        '<html lang="en"><head><meta charset="utf-8"></meta><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta><base target="_blank" url="https://foo.com"></base></head><body></body></html>',
      ),
    );
  });
});

function doc(input: string): string {
  return `<!DOCTYPE html>\n${input}`;
}
