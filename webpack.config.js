module.exports = {
  entry: "./entry.js",
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