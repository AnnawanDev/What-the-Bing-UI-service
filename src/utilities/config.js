/*
  Ed Wied
  January 15, 2022
  CS 361 Final Project - What the Bing?!
*/

//global contants used for configuration
//pattern for sharing constants used from https://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules

module.exports = Object.freeze({
    ENABLE_LOGGING: true,
    RUNNING_LOCAL: true,
    LOCAL_IMAGE_SERVICE: 'http://localhost:4000/images/',
    OSU_IMAGE_SERVICE: 'http://flip3.engr.oregonstate.edu:12789/images/',
    LOCAL_PORT: 3000,
    OSU_PORT: 12073,
    LOCAL_NOUN_SERVICE: 'http://localhost:5001/words',
    OSU_NOUN_SERVICE: 'http://flip3.engr.oregonstate.edu:13789/words'
});
