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
const cookieParser = require('cookie-parser');
const axios = require('axios');
const { logIt, getImageServiceURL } = require('./utilities/helperFunctions.js');
const { LOCAL_PORT, OSU_PORT, RUNNING_LOCAL } = require('./utilities/config.js');
let wordlist = undefined;

//set up mysql-session store
//todo -
// 1 - setup different environment option toggle
// 2 - create real credentials and store in .env file
//setup option code from https://www.npmjs.com/package/express-mysql-session -- Feb 6, 2022
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// ----- PAGES -----
//set up home page
app.get('/', (req, res) => {
  res.render('home', {
    title: 'What the Bing?!'
  });
});

// FAQ page
app.get('/How-to-Play', (req, res) => {
  res.render('how-to-play', {
    title: 'What the Bing?! - How to Play'
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
  logIt("Word to guess: " + wordsToGuess[0]);
  req.session.wordsToGuess = wordsToGuess;
  logIt("SESSION ID: " + req.session.id);

  //render page
  res.render('play', {
    title: 'What the Bing?! - Play!'
  });
});


// ----- Helper APIs -----------------------------------------------------------
app.get('/api/getCurrentImage', async (req, res) => {
	//TODO: Check for valid session

  let searchTerm = req.session.wordsToGuess[req.session.currentWordIndex];
  let url = getImageServiceURL() + searchTerm + "/8";
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
});

app.post('/api/checkGuess', async (req, res) => {
	console.log("USER GUESS: " + req.body['guess']);
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

app.get('/api/getCurrentSearchTerm', async (req, res) => {
	//TODO: Check for valid session -- only return value if session is valid

  const searchTerm = req.session.wordsToGuess[req.session.currentWordIndex];
	logIt("RETURNING SEARCH TERM: " + searchTerm);

	//TODO: capture game stats?  make sure that time wasn't greater than 90 seconds?

	//destroy the session so that new game is on another session
	req.session.destroy();

	//return search term
  res.status(200).send({searchTerm: searchTerm});
});

app.get('/api/getRandomImage', async (req, res) => {
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
app.get('*', (req, res) => {
  res.render('404', {
    title: '404 - Page not found'
  });
});


// helper functions  -----------------------------------------------------------
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
	return "http://localhost:5000/words";
}

// start-up Express  -----------------------------------------------------------
app.listen(port, () => {
  logIt("What the Bing?! UI Service has started on port " + port);
});
