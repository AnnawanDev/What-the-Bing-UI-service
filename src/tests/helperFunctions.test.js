/*
  Ed Wied
  February 17, 2022
  CS 361 Final Project - What the Bing?!
*/

const { getImageServiceURL, getNounURL } = require('../utilities/helperFunctions');
const { RUNNING_LOCAL } = require('../utilities/config');

test('Should return correct Image Service URL', () => {
  const imageServiceURL = getImageServiceURL();

  if (RUNNING_LOCAL) {
    expect(imageServiceURL).toBe('http://localhost:4000/images/');
  } else {
    expect(imageServiceURL).toBe('http://flip3.engr.oregonstate.edu:12789/images/');
  }
});

test('Should return correct Noun Service URL', () => {
  const imageServiceURL = getNounURL();

  if (RUNNING_LOCAL) {
    expect(imageServiceURL).toBe('http://localhost:5001/words');
  } else {
    expect(imageServiceURL).toBe('http://flip3.engr.oregonstate.edu:13789/words');
  }
});
