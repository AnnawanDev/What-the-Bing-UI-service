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
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
// const cookieParser = require('cookie-parser');
const axios = require('axios');
const { logIt, getImageServiceURL } = require('./utilities/helperFunctions.js');
const { LOCAL_PORT, OSU_PORT, RUNNING_LOCAL } = require('./utilities/config.js');

//set up mysql-session store
var options = {
	host: 'localhost',
	port: 3306,
	user: 'session-test',
	password: 'password',
	database: 'bingtest'
};

var sessionStore = new MySQLStore(options);


// set-up Express --------------------------------------------------------------
const app = express();
const port = RUNNING_LOCAL ? LOCAL_PORT : OSU_PORT;
const publicDirectory = path.join(__dirname, '../public');
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(publicDirectory));
// app.use(session({
//   secret: `process.env.SESSION_PASSWORD`,
//   cookie: { maxAge: 1000*3 },
//   resave: false,
//   saveUninitialized: true
// }));
app.use(session({
	key: 'session_cookie_name',
	secret: 'session_cookie_secret',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());


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
app.get('/play', async (req,res) => {
  //gets current time to make sure later player isn't cheating
  let startGameTime = Date.now();
  console.log("Starting new game at: " + startGameTime);

  //start new game session
  req.session.currentWordIndex = 0;
  req.session.gameStartTime = startGameTime;

  //get list of words to guess
  let wordsToGuess = await getWordList();
  console.log(wordsToGuess);
  req.session
  console.log("SESSION ID: " + req.session.id);

  //render page
  res.render('play', {
    title: 'What the Bing?! - Play!'
  });
});




// ----- Helper APIs -----------------------------------------------------------
// app.get('/api/getCurrentImage/:sid', (req, res) => {
//   if (req.params.sid) {
//     // let theID = req.params.sid;
//     //
//     // let x = sessionStore.get(theID, (error, session) => {
//     //   console.log("value: " + JSON.stringify(session));
//     //   res.status(200).send(JSON.stringify(session.currentWordIndex));
//     // });
//
//   } else {
//     res.status(200).send("can't help");
//   }
// });

app.get('/api/getCurrentImage', async (req, res) => {


  // let headers = {};
  // try {
  //     let res = await fetch(url, {
  //       method: 'GET',
  //       mode: 'cors'
  //     });
  //     return await res.json();
  // } catch (error) {
  //     console.log("fetch images error: " + error);
  //     //todo - need error return value
  // }


  let searchTerm = "chess";
  let url = getImageServiceURL() + searchTerm;  //will need to get search term from session
  axios.get(url)
  .then(function (response) {
    // handle success
    console.log(response);
    // let context = {};
    // context.imagePath0 = response.data.value[0].contentUrl;
    // context.imagePath1 = response.data.value[1].contentUrl;
    // context.imagePath2 = response.data.value[2].contentUrl;
    // context.imagePath3 = response.data.value[3].contentUrl;
    // context.imagePath4 = response.data.value[4].contentUrl;
    // context.imagePath5 = response.data.value[5].contentUrl;
    // context.imagePath6 = response.data.value[6].contentUrl;
    // context.imagePath7 = response.data.value[7].contentUrl;
    // context.imagePath8 = response.data.value[8].contentUrl;
    res.status(200).send(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log("ERROR: " + error);
    res.status(500).send(error);
  })






});


// ----- Display 404 to anything else ------------------------------------------
app.get('*', (req, res) => {
  res.render('404', {
    title: '404 - Page not found'
  });
});


// helper functions  -----------------------------------------------------------
async function getWordList() {
  const wordsToGuess = ["basketball", "snow", "summer", "knight", "beach", "sword", "lake", "hawaii", "volcano", "oregon", "mountain", "fish", "shark", "river", "horse", "cat", "penguin", "turtle", "laptop", "chess", "GitHub", "dog", "heart"];
  let wordsInNewOrder = _.shuffle(wordsToGuess)
  return wordsToGuess;
}

// start-up Express  -----------------------------------------------------------
app.listen(port, () => {
  logIt("What the Bing?! UI Service has started on port " + port);
});
