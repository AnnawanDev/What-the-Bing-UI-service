/*
  Ed Wied
  January 31, 2022
  CS 361 Final Project - What the Bing?!
*/

const { ENABLE_LOGGING, RUNNING_LOCAL, LOCAL_IMAGE_SERVICE, OSU_IMAGE_SERVICE } = require('./config.js');


//common function to log messages to console rather than use console.log for everyone
function logIt(someMessage) {
  if (ENABLE_LOGGING) {
    console.log(someMessage);
  }
}

function getImageServiceURL() {
  if (RUNNING_LOCAL) {
    return LOCAL_IMAGE_SERVICE;
  } else {
    return OSU_IMAGE_SERVICE;
  }
}

module.exports = {
  logIt,
  getImageServiceURL
}
