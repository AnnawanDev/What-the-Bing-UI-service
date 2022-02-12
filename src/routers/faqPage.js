/*
  Ed Wied
  February 12, 2022
  CS 361 Final Project - What the Bing?!
*/

const express = require('express');
const router = new express.Router();

router.get('/FAQ', (req, res) => {
  res.render('FAQ', {
    title: 'What the Bing?! - FAQ'
  });
});

module.exports = router;
