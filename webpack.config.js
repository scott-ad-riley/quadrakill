const Path = require('path')

module.exports = {
  entry: Path.join(__dirname + "/client/public/src/index.js"),
  output: {
    path: Path.join(__dirname + "/client/public/build"),
    filename: "bundle.js"
  },
  module:{
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  devtool: 'source-map'
}
