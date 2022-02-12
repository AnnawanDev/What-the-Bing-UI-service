/*
  Ed Wied
  February 12, 2022
  CS 361 Final Project - What the Bing?!
*/

const express = require('express');
const router = new express.Router();
const { logIt, getWordList } = require('../utilities/helperFunctions.js');

router.get('/play', async (req,res) => {
  //gets current time to make sure later player isn't cheating
  let startGameTime = Date.now();
  logIt("Starting new game at: " + startGameTime);

  //start new game session
  req.session.currentWordIndex = 0;
  req.session.gameStartTime = startGameTime;

  //get list of words to guess
  let wordsToGuess = await getWordList();
  logIt("Word to guess: " + wordsToGuess[0]);
  req.session.wordsToGuess = wordsToGuess;
  logIt("SESSION ID: " + req.session.id);

  //render page
  res.render('play', {
    title: 'What the Bing?! - Play!'
  });
});

module.exports = router;
