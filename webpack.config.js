module.exports = {
  entry: "./modules/index.js",
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