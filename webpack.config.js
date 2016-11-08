module.exports = {
  entry: "./modules/index.js",
  output: {
    path: './dist',
    filename: 'app.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" }
    ]
  }
};