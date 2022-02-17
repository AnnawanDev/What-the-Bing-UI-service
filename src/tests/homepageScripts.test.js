/**
 * @jest-environment jsdom
 */

/*
  Ed Wied
  February 17, 2022
  CS 361 Final Project - What the Bing?!
*/

const { getRandomNumber } = require('../../public/js/homepageScripts.js');

test('Random number should not be higher than 10', () => {
  for (let i=0; i < 100; i++) {
    const someNumber = getRandomNumber(10);
    expect(someNumber).toBeLessThan(10);
    expect(someNumber).toBeGreaterThanOrEqual(0); 
  }
});
