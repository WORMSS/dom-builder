import type { Dom } from './Dom';
import { DomTests } from './Dom.spec';
import { HtmlTests } from './Html.spec';
import { createElementTests } from './createElement.spec';
import { createHtmlTests } from './createHtml.spec';
import { createScriptTests } from './createScript.spec';

let testsRan = 0;
DomTests(test);
HtmlTests(test);
createElementTests(test);
createHtmlTests(test);
createScriptTests(test);

console.log(`\n${testsRan} Tests Passed\n`);

function test(input: Dom, expected: string) {
  const result = input.toString();
  testsRan++;
  if (result !== expected) {
    console.error(`\n${testsRan}) Expected "${result}" to equal "${expected}"\n`);
    (globalThis as unknown as any).process.exit(1);
  }
}

export type Tester = typeof test;
