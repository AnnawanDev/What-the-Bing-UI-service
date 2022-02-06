/*
  Ed Wied
  January 26, 2022
  CS 361 Final Project - What the Bing?!
*/

let numImages = 14;
const resetNumberOfImages = 14;
let imageArray;


document.addEventListener("DOMContentLoaded", async function(event) {
  //wire up start buttoon
  //document.getElementById("gameStart").addEventListener("click", playGame);

  imageArray = setUpImageArray(numImages);

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
  let imageID = "image" + getRandomNumber(9);
  //let imageSrc = '/images/home-loading/image' + getRandomNumber(14) + '.jpg';

  //get random image to update
  let itemToShow = '/images/home-loading/' + popOffOneOfTheImages() + '.jpg';

  //image #4 is the text "Play What the Bing" so don't change that
  if (imageID != "image4") {
    document.getElementById(imageID).src = itemToShow; //imageSrc;
  }


}

function getRandomNumber(highNumberNotInclusive) {
  return Math.floor(Math.random() * highNumberNotInclusive);
}

function setUpImageArray(numberOfImages) {
  let tempArray = [];
  for (let i=0; i < numberOfImages; i++) {
    tempArray.push("image" + i);
  }
  return tempArray;
}

function popOffOneOfTheImages() {
  //console.log("STARTING: " + imageArray);

  //get array length
  let arrayLength = imageArray.length;

  if (arrayLength == 0) {
    //need to repopulate array
    imageArray = setUpImageArray(14);
  }

  let getRandomNumberToPop = getRandomNumber(arrayLength);
  //console.log("item to remove: " + getRandomNumberToPop);
  let item = imageArray.splice(getRandomNumberToPop, 1);
  //console.log(item);
  //console.log("ENDING: " + imageArray);
  return item;
}
