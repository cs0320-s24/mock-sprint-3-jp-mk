/*
  Demo: test ordinary Java/TypeScript
*/

import { expect, test } from 'vitest';

// all exports from main will now be available as main.X
// import * as main from '../mock/src/main';
import * as main from '../../src/main';

test('is 1 + 1 = 2?', () => {
  expect(1 + 1).toBe(2)
})

// Notice how you can test vanilla TS functions using Playwright as well!
test('main.zero() should return 0', () => {
  expect(main.zero()).toBe(0)
})

// For more information on how to make unit tests, visit:
// https://jestjs.io/docs/using-matchers

test('title', async ({ page }) => { 
  expect(page.getByText('Submit'))
})

/**
 * Stuff to know:
 * /regex/ in javascript
 * 
 * 
 * 
 * await - Because there is only one thread in JS... you have to wait for every other process on that thread to finish
 * async - specifies an asynchronous function
 * test shoudl match the displayed text
 * 
 * 
 * test stateful behavior (aka unit tests as you know them, but make sure states and variables are what you expect them to be)
 */