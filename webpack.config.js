const path = require('path');
module.exports = {
  mode: 'production',
  entry: './src/app.js',
  output: {
      filename: 'app.js',
      path: path.join(__dirname, 'public')
  },
  module: {
    rules: [{
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
    }]
  },
  performance: {
    hints: false
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  }
};