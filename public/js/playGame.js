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
const apiServiceToGetWords = "http://localhost:5000/api/wordList";
const apiFetchImage = "http://localhost:4000/images/";
let theGameCountdownClock;

document.addEventListener("DOMContentLoaded", async function(event) {
  //mix up words
  //OLD - moving to server side
  // wordsToGuess = await getWordList();
  // console.log(wordsToGuess);

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
  let totalGameTime = 90;

  //set up initial game state so only instructions appear
  //TODO: Need function to add/remove blocks from DOM rather than style.display
  //document.getElementById('readyToPlayDiv').style.display = "none !important;";
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
  //todo - get word
  //todo - sanitize user input
  
  let userInput = document.getElementById('inputGuessSearch').value.trim().toLowerCase();

  //clear out user guess
  document.getElementById('inputGuessSearch').value = '';

  //check answer
  let didUserGetCorrect = await checkGuessOnServer(userInput);
  console.log("didUserGetCorrect: " + didUserGetCorrect)

  //TODO - need to do something here to prevent cheating

  if (didUserGetCorrect == "correct") {
    document.getElementById('userGuesses').innerHTML = "<p style=\"margin-top: 20px; color:#ffffff;\">YES! It was " + userInput.toLowerCase() + "</p>";
    increasePlayerScore(); //TODO - make sure user can't hit the right answer multiple times for the same search term
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

    fetch("http://localhost:3000/api/checkGuess", {   //TODO - move URL to function to get endpoint depending on whether running local or not
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    }).then(res => {
      console.log("Request complete! response:", res);
      return res.json();
    }).then((data) => {
      //console.log ("DATA: " + data);
      console.log(data.answer);
      if (data.answer === 'correct') {
        resolve("correct");
      } else {
        resolve("not correct");
      }
    }).catch(function(error) {
      console.log(error);    //TODO - do something with this error handling
      reject("something went wrong: " + error);
    });
  });
}


function displayFinalWord() {
  document.getElementById('finalWord').innerHTML = "It was <span style=\"font-size: 3em\">" + wordsToGuess[currentIndexForWordToGuess] + "</span>";
}

//OLD
// async function fetchImages(searchTerm) {
//     let url = apiFetchImage + searchTerm;  //move to server side
//     let headers = {};
//     try {
//         let res = await fetch(url, {
//           method: 'GET',
//           mode: 'cors'
//         });
//         return await res.json();
//     } catch (error) {
//         console.log("fetch images error: " + error);
//     }
// }

//NEW
async function fetchImages(searchTerm) {
    let url = "http://localhost:3000/api/getCurrentImage";
    let headers = {};  //need to send cookie
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

    //TODO - switch to for loop
    //TODO - need to check for 4xx on image so a broken image is not displayed
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
  // for (let i = 0; i++; i < 8) {
  //   document.getElementById('image' + i).src = "/images/loading.jpg";
  // }

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
      //console.log("time left: " + timeToDisplay);
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
