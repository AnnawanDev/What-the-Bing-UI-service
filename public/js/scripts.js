/*
  Ed Wied
  January 15, 2022
  CS 361 Final Project - What the Bing?!
*/


// document.addEventListener("DOMContentLoaded", function(event) {
//   //wire-up button actions
//   document.getElementById("startImageButton").addEventListener("click", writeRunToPRNG);
//   document.getElementById("updateImageButton").addEventListener("click", displayImage);
//   document.getElementById("reset").addEventListener("click", resetEverything);
// });
//
// async function writeRunToPRNG() {
//     let response = await fetch('/runPRNGService');
//     if (response.status == 200) {
//       //console.log('success in calling PRNG service');
//     } else {
//       //console.log('error in calling PRNG service');
//     }
// }
//
// async function displayImage() {
//   let response = await fetch('http://localhost:3000/readImagePath');
//   let data = await response.text();
//   //console.log(data);
//   let theImage = document.getElementById("theImage");
//   theImage.src = data;
// }
//
// async function resetEverything() {
//   //reset display image
//   let theImage = document.getElementById("theImage");
//   theImage.src = "/images/no-image.jpg";
//
//   //reset text files
//   let response = await fetch('http://localhost:3000/resetFiles');
// }
