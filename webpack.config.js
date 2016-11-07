module.exports = {
  entry: "./app.js",
  output: {
    path: __dirname,
    filename: "app-compiled.js"
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" }
    ]
  }
};