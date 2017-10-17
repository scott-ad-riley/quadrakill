#!/usr/bin/env bash

ssh -v travis@138.68.142.81 'echo worked >> ~/testing'
$TRAVIS_BUILD_DIR/node_modules/.bin/babel server -d server_dist
rsync -avzqr --delete-after $TRAVIS_BUILD_DIR travis@138.68.142.81:/var/www/quadrakill.placeofthin.gs
