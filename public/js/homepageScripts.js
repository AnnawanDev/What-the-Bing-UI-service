/*
  Ed Wied
  January 26, 2022
  CS 361 Final Project - What the Bing?!
*/


document.addEventListener("DOMContentLoaded", async function(event) {
  //wire up start buttoon
  document.getElementById("gameStart").addEventListener("click", playGame);
});

function playGame() {
  window.location = "/play";
}
