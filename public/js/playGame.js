/*
  Ed Wied
  January 15, 2022
  CS 361 Final Project - What the Bing?!
*/

//todo - move score tracking server side rather than client side
//todo - move all the guessing/answering to server side

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

document.addEventListener("DOMContentLoaded", async function(event) {
  //set up initial game state so only instructions appear
  togglePlayVisibility();

  //begin countdown timer to play
  startCountdownTimerToPlay();
});


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

async function getWordList() {
  let headers = {};
  try {
      let res = await fetch(apiServiceToGetWords);
      return await res.json();
  } catch (error) {
      console.log("fetch images error: " + error);
  }
}

function showBoardAndStartGame() {
  //configure game time
  let totalGameTime = TOTAL_GAME_TIME;

  //set up initial game state so only instructions appear
  document.getElementById('getReadyToPlayImage').style.display = "none";
  document.getElementById('readyToPlayDiv').remove();


  document.getElementById('theGameDiv').style.display = "block";
  document.getElementById('searchInputBoxDiv').style.diplay = "block";
  document.getElementById('gameOverDiv').style.display = "none";

  //set score to 0
  document.getElementById('gameOverDiv').style.display = "none";

  //fetch images
  displayImages();

  //start game
  startGame(totalGameTime);

  //wire up input button
  document.getElementById("btnGuessSearch").addEventListener("click", checkGuess);
}

function increasePlayerScore() {
  numberCorrect++;
  document.getElementById('playerScore').innerHTML = numberCorrect;
}

async function checkGuess() {
  let userInput = document.getElementById('inputGuessSearch').value.trim().toLowerCase();

  //clear out user guess
  document.getElementById('inputGuessSearch').value = '';

  //check answer
  let didUserGetCorrect = await checkGuessOnServer(userInput);
  console.log("didUserGetCorrect: " + didUserGetCorrect)

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


async function displayFinalWord() {

  let finalSearchTerm = await getFinalTerm();
  console.log("final search term: " + finalSearchTerm);
  document.getElementById('finalWord').innerHTML = "<span style=\"font-size: 2em\">It was " + finalSearchTerm + "</span>";
}

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

    let container0 = document.querySelector('#image0');
    container0.src = `${images.imagePath0}`;

    let container1 = document.querySelector('#image1');
    container1.src = `${images.imagePath1}`;

    let container2 = document.querySelector('#image2');
    container2.src = `${images.imagePath2}`;

    let container3 = document.querySelector('#image3');
    container3.src = `${images.imagePath3}`;

    let container4 = document.querySelector('#image4');
    container4.src = `${images.imagePath4}`;

    let container5 = document.querySelector('#image5');
    container5.src = `${images.imagePath5}`;

    let container6 = document.querySelector('#image6');
    container6.src = `${images.imagePath6}`;

    let container7 = document.querySelector('#image7');
    container7.src = `${images.imagePath7}`;
}

function switchImagesToLoading() {
  document.getElementById('image0').src = "/images/loading.jpg";
  document.getElementById('image1').src = "/images/loading.jpg";
  document.getElementById('image2').src = "/images/loading.jpg";
  document.getElementById('image3').src = "/images/loading.jpg";
  document.getElementById('image4').src = "/images/loading.jpg";
  document.getElementById('image5').src = "/images/loading.jpg";
  document.getElementById('image6').src = "/images/loading.jpg";
  document.getElementById('image7').src = "/images/loading.jpg";
}

let theGameTimer;
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

function stopGame() {
  document.getElementById('inputGuessSearch').disabled = true;
  document.getElementById('btnGuessSearch').disabled = true;
  document.getElementById('searchInputBoxDiv').style.diplay = "none";
  document.getElementById('gameOverDiv').style.display = "block";
  displayFinalWord();
}
