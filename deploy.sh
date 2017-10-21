#!/usr/bin/env bash
set -e

$TRAVIS_BUILD_DIR/node_modules/.bin/babel server -d $TRAVIS_BUILD_DIR/server_dist
ssh travis@138.68.142.81 "echo $(git rev-parse HEAD) >> ~/deploys"
ssh travis@138.68.142.81 "mkdir /home/travis/app/quadrakill.placeofthin.gs/$(git rev-parse HEAD)"
rsync -avzqr --delete-after $TRAVIS_BUILD_DIR/ travis@138.68.142.81:/home/travis/app/quadrakill.placeofthin.gs/$(git rev-parse HEAD)
ssh travis@138.68.142.81 "ln -sfn /home/travis/app/quadrakill.placeofthin.gs/$(git rev-parse HEAD) /var/www/quadrakill"
ssh travis@138.68.142.81 'pm2 reload socket-server'
