/*
  Ed Wied
  January 31, 2022
  CS 361 Final Project - What the Bing?!
*/

const axios = require('axios');
const _ = require('underscore');
const { ENABLE_LOGGING, RUNNING_LOCAL, LOCAL_IMAGE_SERVICE, OSU_IMAGE_SERVICE, LOCAL_NOUN_SERVICE, OSU_NOUN_SERVICE } = require('./config.js');
let wordlist = undefined;

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

////////
async function getWordList() {
	return new Promise((resolve, reject) => {
			console.log("FETCHING FROM NOUN SERVICE");
			let url = getNounURL(); console.log("URL: " + url);

		  axios.get(url)
		  .then(function (response) {
		    // handle success
		    //res.status(200).send(response.data);
				wordlist = response.data;
				console.log(wordlist);
				let wordsInNewOrder = _.shuffle(wordlist)
				resolve(wordsInNewOrder);
		  })
		  .catch(function (error) {
		    // handle error
		    console.log("ERROR: " + error);
		    //res.status(500).send(error);
				reject(error);
		  })
	});
}

function getNounURL() {
	if (RUNNING_LOCAL) {
		return LOCAL_NOUN_SERVICE;
	} else {
		return OSU_NOUN_SERVICE
	}
}

function getDBConnection() {
	let host = RUNNING_LOCAL ? process.env['LOCAL_HOST'] : process.env['OSU_HOST'];
	let port = RUNNING_LOCAL ? process.env['LOCAL_PORT'] : process.env['OSU_PORT'];
	let user = RUNNING_LOCAL ? process.env['LOCAL_USER'] : process.env['OSU_USER'];
	let password = RUNNING_LOCAL ? process.env['LOCAL_PASSWORD'] : process.env['OSU_PASSWORD'];
	let database = RUNNING_LOCAL ? process.env['LOCAL_DATABASE'] : process.env['OSU_DATABASE'];

	let returnJSON = {};
	returnJSON['host'] = host;
	returnJSON['port'] = port;
	returnJSON['user'] = user;
	returnJSON['password'] = password;
	returnJSON['database'] = database;

	return returnJSON;
}

module.exports = {
  logIt,
  getImageServiceURL,
  getWordList,
  getNounURL,
  getDBConnection
}
