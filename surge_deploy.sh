$TRAVIS_BUILD_DIR/node_modules/.bin/webpack
rm -rf $TRAVIS_BUILD_DIR/surge
mkdir $TRAVIS_BUILD_DIR/surge
cp $TRAVIS_BUILD_DIR/client/public/build/bundle.js surge/
cp -r $TRAVIS_BUILD_DIR/client/public/assets/* surge/
