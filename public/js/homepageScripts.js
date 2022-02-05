/*
  Ed Wied
  January 26, 2022
  CS 361 Final Project - What the Bing?!
*/


document.addEventListener("DOMContentLoaded", async function(event) {
  //wire up start buttoon
  //document.getElementById("gameStart").addEventListener("click", playGame);

  //randomize images
  setInterval(randomizeImageSquares, 1000);
});

function playGame() {
  window.location = "/play";
}

function showHideDescriptionText() {
  let currentState = document.getElementById('addedDescription').style.display;
  if (currentState === "none") {
    document.getElementById('addedDescription').style.display = "block";
    document.getElementById('readMoreLink').text = "Hide";
  } else {
    document.getElementById('addedDescription').style.display = "none";
    document.getElementById('readMoreLink').text = "Read more";
  }
  return false;
}

function randomizeImageSquares() {
  let imageID = "image" + getRandomNumber();
  let imageSrc = '/images/home-loading/image' + getRandomNumber() + '.jpg';
  document.getElementById(imageID).src = imageSrc;
}

function getRandomNumber() {
  return Math.floor(Math.random() * 9);
}
