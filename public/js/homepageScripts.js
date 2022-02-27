/*
  Ed Wied
  January 26, 2022
  CS 361 Final Project - What the Bing?!
*/

let numImages = 31;
let imageArray;
const runningLocal = true;
const getRandomImageAPILOCAL = "http://localhost:3000/api/getRandomImage";
const getRandomImageAPIOSU = "http://flip3.engr.oregonstate.edu:12073/api/getRandomImage";

document.addEventListener("DOMContentLoaded", async function(event) {
  imageArray = setUpImageArray(numImages);

  //randomize images
  setInterval(randomizeImageSquares, 1000);


});

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

async function randomizeImageSquares() {
  let imageID = "image" + getRandomNumber(9);
  //let imageSrc = '/images/home-loading/image' + getRandomNumber(14) + '.jpg';

  //get random number
  let randomNumber = getRandomNumber(100);

  //get random image to update
  //if randomNumber is < 3, then chose from Bing API from a random word
  //otherwise, choose default image to load
  let itemToShow;
  if (randomNumber < 10) {
    itemToShow = await getRandomImage();
  } else {
    itemToShow = '/images/home-loading/' + popOffOneOfTheImages() + '.jpg';
  }

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
  //get array length
  let arrayLength = imageArray.length;

  if (arrayLength == 0) {
    //need to repopulate array
    imageArray = setUpImageArray(numImages);
  }

  let getRandomNumberToPop = getRandomNumber(arrayLength);
  //console.log("item to remove: " + getRandomNumberToPop);
  let item = imageArray.splice(getRandomNumberToPop, 1);
  //console.log(item);
  //console.log("ENDING: " + imageArray);
  return item;
}

async function getRandomImage() {
  return new Promise((resolve, reject) => {
    let randomImageURL = runningLocal ? getRandomImageAPILOCAL : getRandomImageAPIOSU;
    //http://localhost:3000/api/getRandomImage
    fetch(randomImageURL, {   //TODO - move URL to function to get endpoint depending on whether running local or not
      method: "GET",
      headers: {'Content-Type': 'application/json'}
    }).then(res => {
      console.log("Request complete! response:", res);
      return res.json();
    }).then((data) => {

      console.log("IMAGE: " + data.imagePath0);
      resolve(data.imagePath0);
      //console.log ("DATA: " + data);
      // console.log(data.answer);
      // if (data.answer === 'correct') {
      //   resolve("correct");
      // } else {
      //   resolve("not correct");
      // }
    }).catch(function(error) {
      console.log(error);    //TODO - do something with this error handling
      reject("something went wrong: " + error);
    });
  });
}

module.exports = {
  getRandomNumber
}
