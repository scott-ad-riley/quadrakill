# Quadrakill

[![Greenkeeper badge](https://badges.greenkeeper.io/scott-ad-riley/quadrakill.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/scott-ad-riley/quadrakill.svg?branch=master)](https://travis-ci.org/scott-ad-riley/quadrakill)

## Deployment

* Auto deploys are setup on master
  * The socket server is being deployed to a Digital Ocean VPS
    * There's some additional work to be done here, see [this issue](https://github.com/scott-ad-riley/quadrakill/issues/4)
  * The static files/frontend is on surge
    * There's some additional work to be done here too, see [this issue](https://github.com/scott-ad-riley/quadrakill/issues/3)

## Setup

* `git clone` this repo
* `npm i`

## Running

* run `npm start`
  * open browser to http://localhost:3000
* or `npm run dev`
  * if you want webpack/nodemon to watch for changes and reload
* `npm test`
