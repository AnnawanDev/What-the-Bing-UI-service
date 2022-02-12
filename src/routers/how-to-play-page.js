/*
  Ed Wied
  February 12, 2022
  CS 361 Final Project - What the Bing?!
*/

const express = require('express');
const router = new express.Router();

router.get('/How-to-Play', (req, res) => {
  res.render('how-to-play', {
    title: 'What the Bing?! - How to Play'
  });
});

module.exports = router;
