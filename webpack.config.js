module.exports = {
  entry: "./src/index.js",
  output: {
    path: './dist',
    filename: 'app.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" }
    ]
  }
};