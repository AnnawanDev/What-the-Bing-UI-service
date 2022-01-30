# What the Bing? UI Service
This is the UI service for the "What the Bing?" Game


## What the Bing?
Long ago there was a Flash game that I thought was really inventive.  It was developed by Grant Skinner and was called “Guess the Google”.  The user was presented with 9 images and they had to guess what search term was used that resulted in the images.  If they got it right, then they were presented with a new batch of images to guess.  If they got it wrong, they had to keep guessing as time allowed.  I thought I would try to recreate this game as best I can.


## Setup
This project uses the [dotenv](https://www.npmjs.com/package/dotenv) NPM package in order to separate out the saving of configuration from app code. Recreating the `.env` would look like,

```
SESSION_PASSWORD={some super secret password}
```


## How to run
### Local
* Build and Run: `npm run start`
* Build and Run in Debug (nodemon): `npm run dev`

### Production
* Build and Run with Forever: `npm run prod`
* Stop Forever Production Run: `npm run stopProd`
