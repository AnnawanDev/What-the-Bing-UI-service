/*
  Ed Wied
  February 12, 2022
  CS 361 Final Project - What the Bing?!
*/

const express = require('express');
const router = new express.Router();

router.get('/', (req, res) => {
  res.render('home', {
    title: 'What the Bing?!'
  });
});

module.exports = router;
