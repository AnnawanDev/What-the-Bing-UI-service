/*
  Ed Wied
  January 15, 2022
  CS 361 Final Project - What the Bing?!
*/


// set-up required modules -----------------------------------------------------
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
require('dotenv').config({path: __dirname + '/.env'})
const { logIt, getImageServiceURL, getDBConnection, getWordList } = require('./utilities/helperFunctions.js');
const { LOCAL_PORT, OSU_PORT, RUNNING_LOCAL } = require('./utilities/config.js');
let wordlist = undefined;

//set up mysql-session store
//todo -
// 1 - setup different environment option toggle
// 2 - create real credentials and store in .env file
//setup option code from https://www.npmjs.com/package/express-mysql-session -- Feb 6, 2022
var options = getDBConnection();
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


// Page routers -----------------------------------------------
const homePage = require('./routers/homePage.js');
const howToPlayPage = require('./routers/how-to-play-page.js');
const faqPage = require('./routers/faqPage.js');
const playPage = require('./routers/playPage.js');
const apis = require('./routers/apis.js');

app.use(homePage);
app.use(howToPlayPage);
app.use(faqPage);
app.use(playPage);
app.use(apis);


// start-up Express  -----------------------------------------------------------
app.listen(port, () => {
  logIt("What the Bing?! UI Service has started on port " + port);
});
