/*
  Ed Wied
  February 12, 2022
  CS 361 Final Project - What the Bing?!
*/

const express = require('express');
const router = new express.Router();
const axios = require('axios');
const _ = require('underscore');
const { logIt, getWordList, getImageServiceURL } = require('../utilities/helperFunctions.js');

router.get('/api/getCurrentImage', async (req, res) => {
	//TODO: Check for valid session

  let searchTerm = req.session.wordsToGuess[req.session.currentWordIndex];
  let url = getImageServiceURL() + searchTerm + "/8";
	logIt("URL to fetch: " + url);
  axios.get(url)
  .then(function (response) {
    // handle success
    res.status(200).send(response.data);
  })
  .catch(function (error) {
    // handle error
    logIt("ERROR: " + error);
    res.status(500).send(error);
  })
});

router.post('/api/checkGuess', async (req, res) => {
	logIt("USER GUESS: " + req.body['guess']);
	let didGetCorrect = false;

	let userGuess = req.body['guess'].toLowerCase();
	let msg = "";

	if (req.session.wordsToGuess[req.session.currentWordIndex].toLowerCase() === userGuess) {
		didGetCorrect = true;
		req.session.currentWordIndex++;
		console.log("yes - user guess was correct");
		msg = {"answer":"correct"};
		//TODO - need to do something here to (1) increment score (2) make sure user isn't above timer
	} else {
		console.log("no - user guess was *not* correct");
		msg = {"answer":"wrong"}
	}

	res.status(200).send(msg);
});

router.get('/api/getCurrentSearchTerm', async (req, res) => {
	//TODO: Check for valid session -- only return value if session is valid

  const searchTerm = req.session.wordsToGuess[req.session.currentWordIndex];
	logIt("RETURNING SEARCH TERM: " + searchTerm);

	//TODO: capture game stats?  make sure that time wasn't greater than 90 seconds?

	//destroy the session so that new game is on another session
	req.session.destroy();

	//return search term
  res.status(200).send({searchTerm: searchTerm});
});

router.get('/api/getRandomImage', async (req, res) => {
	//get list of words
	let wordsToGuess = await getWordList();

	//randomize list
	let wordsInNewOrder = _.shuffle(wordsToGuess);

	//use the first word from list
	let searchTerm = wordsInNewOrder[0]

	let url = getImageServiceURL() + searchTerm + "/1";
	console.log("URL to fetch: " + url);
  axios.get(url)
  .then(function (response) {
    // handle success
    res.status(200).send(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log("ERROR: " + error);
    res.status(500).send(error);
  })
})


// ----- Display 404 to anything else ------------------------------------------
router.get('*', (req, res) => {
  res.render('404', {
    title: '404 - Page not found'
  });
});


module.exports = router;
