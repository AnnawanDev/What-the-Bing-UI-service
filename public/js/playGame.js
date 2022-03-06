/*
  Ed Wied
  January 15, 2022
  CS 361 Final Project - What the Bing?!
*/

let numberCorrect = 0;
let wordsToGuess = [];
let currentIndexForWordToGuess = 0;
const runningLocal = true;
const apiServiceToGetWordsLOCAL = "http://localhost:5000/api/wordList";
const apiServiceToGetWordsOSU = "http://flip3.engr.oregonstate.edu:13789/api/wordList";
const apiFetchImageLOCAL = "http://localhost:4000/images/";
const apiFetchImageOSU = "http://flip3.engr.oregonstate.edu:12789/images/";
const checkGuessAPILOCAL = "http://localhost:3000/api/checkGuess";
const checkGuessAPIOSU = "http://flip3.engr.oregonstate.edu:12073/api/checkGuess";
const getCurrentSearchTermAPILOCAL = "http://localhost:3000/api/getCurrentSearchTerm";
const getCurrentSearchTermAPIOSU = "http://flip3.engr.oregonstate.edu:12073/api/getCurrentSearchTerm";
const getCurrentImageAPILOCAL = "http://localhost:3000/api/getCurrentImage";
const getCurrentImageAPIOSU = "http://flip3.engr.oregonstate.edu:12073/api/getCurrentImage";
let theGameCountdownClock;
const TOTAL_GAME_TIME = 90;
let theGameTimer;


document.addEventListener("DOMContentLoaded", async function(event) {
  //set up initial game state so only instructions appear
  togglePlayVisibility();

  //begin countdown timer to play
  startCountdownTimerToPlay();
});

// the game has a 3 second countdown before starting to give the user a chance to get ready
function startCountdownTimerToPlay() {
  let theCountdownDiv = document.getElementById('getReadyCountdownTimer');
  let totalCountdown = 3;
  let starting = 0;
  theGameCountdownClock = setInterval(function() {

    if (totalCountdown - starting <= -1) {
      clearInterval(theGameCountdownClock);
      showBoardAndStartGame();

      //set user focus to input box
      document.getElementById("inputGuessSearch").focus();
    } else {

      updatedValue = totalCountdown - starting;
      starting++;
      document.getElementById('getReadyCountdownTimer').innerHTML = updatedValue;
    }
  }, 1000);
}

function togglePlayVisibility() {
  document.getElementById('readyToPlayDiv').style.display = "block";
  document.getElementById('theGameDiv').style.display = "none";
  document.getElementById('searchInputBoxDiv').style.diplay = "none";
  document.getElementById('gameOverDiv').style.display = "none";
}

//gets words list from noun importer service
async function getWordList() {
  let headers = {};
  try {
      let res = await fetch(apiServiceToGetWords);
      return await res.json();
  } catch (error) {
      console.log("fetch images error: " + error);
  }
}

//sets up game and starts
function showBoardAndStartGame() {
  //configure game time
  let totalGameTime = TOTAL_GAME_TIME;

  //set up initial game state so only instructions appear
  document.getElementById('getReadyToPlayImage').style.display = "none";
  document.getElementById('readyToPlayDiv').remove();
  document.getElementById('theGameDiv').style.display = "block";
  document.getElementById('searchInputBoxDiv').style.diplay = "block";
  document.getElementById('gameOverDiv').style.display = "none";
  document.getElementById('gameOverDiv').style.display = "none";  //set score to 0

  //fetch images & start game
  displayImages();
  startGame(totalGameTime);

  //wire up input button
  document.getElementById("btnGuessSearch").addEventListener("click", checkGuess);
}

function increasePlayerScore() {
  numberCorrect++;
  document.getElementById('playerScore').innerHTML = numberCorrect;
}

//function is called when a user checks a guess
async function checkGuess() {
  let userInput = document.getElementById('inputGuessSearch').value.trim().toLowerCase();

  //clear out user guess
  document.getElementById('inputGuessSearch').value = '';

  //check answer
  let didUserGetCorrect = await checkGuessOnServer(userInput);
  console.log("didUserGetCorrect: " + didUserGetCorrect)

  //respond to user input
  respondToUsersGuess(didUserGetCorrect, userInput);
}

function respondToUsersGuess(didUserGetCorrect, userInput) {
  if (didUserGetCorrect == "correct") {
    document.getElementById('userGuesses').innerHTML = "<p style=\"margin-top: 20px; color:#ffffff;\">YES! It was " + userInput.toLowerCase() + "</p>";
    increasePlayerScore();
    currentIndexForWordToGuess++;
    switchImagesToLoading();
    displayImages();
  } else {
    document.getElementById('userGuesses').innerHTML = "<p style=\"margin-top: 20px; color:#ffffff;\">No - not " + userInput + "</p>";
  }
}

async function checkGuessOnServer(someGuess) {
  return new Promise((resolve, reject) => {
    let data = {guess: someGuess};
    let checkGuessURL = runningLocal ? checkGuessAPILOCAL : checkGuessAPIOSU;

    fetch(checkGuessURL, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    }).then(res => {
      console.log("Request complete! response:", res);
      return res.json();
    }).then((data) => {
      console.log(data.answer);
      if (data.answer === 'correct') {
        resolve("correct");
      } else {
        resolve("not correct");
      }
    }).catch(function(error) {
      console.log(error);
      reject("something went wrong: " + error);
    });
  });
}

//displays final word that user was trying to guess when game ends
async function displayFinalWord() {
  let finalSearchTerm = await getFinalTerm();
  console.log("final search term: " + finalSearchTerm);
  document.getElementById('finalWord').innerHTML = "<span style=\"font-size: 2em\">It was " + finalSearchTerm + "</span>";
}

//gets the final term that user was trying to guess
async function getFinalTerm() {
    return new Promise((resolve, reject) => {
      let getCurrentSearchTermURL = runningLocal ? getCurrentSearchTermAPILOCAL : getCurrentSearchTermAPIOSU;

      fetch(getCurrentSearchTermURL, {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
      }).then(res => {
        return res.json();
      }).then((data) => {
        console.log ("DATA: " + data.searchTerm);
        resolve(data.searchTerm);
      }).catch(function(error) {
        console.log(error);
        reject("something went wrong: " + error);
      });
    });
}

//gets images for search term that user is trying to guess
async function fetchImages(searchTerm) {
    let url = runningLocal ? getCurrentImageAPILOCAL : getCurrentImageAPIOSU;
    let headers = {};
    try {
        let res = await fetch(url, {
          method: 'GET',
          mode: 'cors'
        });
        return await res.json();
    } catch (error) {
        console.log("fetch images error: " + error);
    }
}

async function displayImages() {
    let images = await fetchImages(wordsToGuess[currentIndexForWordToGuess]);
    let imageArray = modifyIntoImagesArray(images);

    //for each square, display corresponding image
    for (let i=0; i < 8; i++) {
      let container = document.querySelector(`#image${i}`);
      container.src = imageArray[i];
    }
}

function switchImagesToLoading() {
  for (let i=0; i < 8; i++) {
    document.getElementById(`image${i}`).src = "/images/loading.jpg";
  }
}

function startGame(totalGameTime) {
  let starting = 0;
  theGameTimer = setInterval(function() {

    if (totalGameTime - starting <= -1) {
      clearInterval(theGameTimer);
      stopGame();
    } else {

      let updatedValue = totalGameTime - starting;
      let timeToDisplay = "";
      if (updatedValue >= 10) {
        timeToDisplay = ":" + updatedValue;
      } else {
        timeToDisplay = ":0" + updatedValue;
      }

      document.getElementById('gameTimer').innerHTML = timeToDisplay;
      starting++;
    }
  }, 1000);
}

function modifyIntoImagesArray(images) {
  let imageArray = [];
  for (let [key, value] of Object.entries(images)) {
    imageArray.push(`${value}`)
  }
  return imageArray;
}

function stopGame() {
  document.getElementById('inputGuessSearch').disabled = true;
  document.getElementById('btnGuessSearch').disabled = true;
  document.getElementById('searchInputBoxDiv').style.diplay = "none";
  document.getElementById('gameOverDiv').style.display = "block";
  displayFinalWord();
}
