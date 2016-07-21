config = {
  entry: "./client/public/src/index.js",
  output: {
    filename: "bundle.js",
    path: "./client/public/build"
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module:{
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
      }
    ]
  },
  devtool: 'source-map'
}

module.exports = config;
