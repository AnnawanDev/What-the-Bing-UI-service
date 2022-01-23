/*
  Ed Wied
  January 15, 2022
  CS 361 Final Project - What the Bing?!
*/


// set-up required modules -----------------------------------------------------
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const _ = require('underscore');


// set-up Express --------------------------------------------------------------
const app = express();
const port = 3000;
const publicDirectory = path.join(__dirname, '../public');
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(publicDirectory));


// ----- PAGES -----
//set up home page
app.get('/', (req, res) => {
  res.render('home', {
    title: 'What the Bing?!'
  });
});

// FAQ page
app.get('/FAQ', (req, res) => {
  res.render('FAQ', {
    title: 'What the Bing?! - FAQ'
  });
});

// page for playing the game
app.get('/play', (req,res) => {
  res.render('play', {
    title: 'What the Bing?! - Play!'
  });
});


// ----- Helper APIs -----
app.get('/api/wordList', (req, res) => {
  const wordsToGuess = ["basketball", "slope", "snow", "summer", "knight", "javascript", "sword", "lake", "hawaii", "volcano", "oregon", "mountain", "fish", "shark", "river", "horse", "cat", "penguin", "minecraft", "laptop", "java", "python", "GitHub", "dog", "heart"];
  let wordsInNewOrder = _.shuffle(wordsToGuess)

  res.status(200).send(wordsInNewOrder);
});


//display 404 to anything else
app.get('*', (req, res) => {
  res.render('404', {
    title: '404 - Page not found'
  });
});


// start-up Express  -----------------------------------------
app.listen(port, () => {
  console.log("What the Bing?! UI Service has started on port " + port);
});
