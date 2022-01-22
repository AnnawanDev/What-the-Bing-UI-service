/*
  Ed Wied
  January 15, 2022
  CS 361 Final Project - What the Bing?!
*/


document.addEventListener("DOMContentLoaded", function(event) {
  let totalGameTime = 5;

  displayImages();
  startGame(totalGameTime);
});


async function fetchImages() {
    let url = 'http://localhost:4000/images/january';
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
    let images = await fetchImages();
    // let html = '';
    // users.forEach(user => {
    //     let htmlSegment = `<div class="user">
    //                         <img src="${user.profileURL}" >
    //                         <h2>${user.firstName} ${user.lastName}</h2>
    //                         <div class="email"><a href="email:${user.email}">${user.email}</a></div>
    //                     </div>`;
    //
    //     html += htmlSegment;
    // });


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


function startGame(totalGameTime) {
  let starting = 0;
  let runGame = setInterval(function() {

    if (totalGameTime - starting <= -1) {
      //clearInterval();
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
      console.log("time left: " + timeToDisplay);
      starting++;
    }
  }, 1000);
}

function stopGame() {
  document.getElementById('inputGuessSearch').disabled = true;
  document.getElementById('btnGuessSearch').disabled = true;
}
