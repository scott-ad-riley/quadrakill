#!/usr/bin/env bash

ssh -v travis@138.68.142.81 "echo $(git rev-parse HEAD) >> ~/deploys"
$TRAVIS_BUILD_DIR/node_modules/.bin/babel server -d server_dist
rsync -avzqr --delete-after $TRAVIS_BUILD_DIR travis@138.68.142.81:/var/www/quadrakill.placeofthin.gs
ssh travis@138.68.142.81 'pm2 restart socket-server'
