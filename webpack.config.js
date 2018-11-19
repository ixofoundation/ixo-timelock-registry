// webpack only builds client code
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
var APP = path.resolve(__dirname, 'src');
var BUILD = path.resolve(__dirname, 'build');

var config = {
  // webpack output
  node: {
  fs: 'empty'
},
  mode: 'development',
  entry: APP + '/index.js',
  output: {
    path: BUILD,
    filename: 'bundle.js'
  },
  // use babel
  module: {
    rules: [
      {
        test: /\.js?/,
        include: APP,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'svg-url-loader',
        query: {
          limit: '10000',
          mimetype: 'application/svg+xml'
        }
      }
    ]
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
    }) // generates the index.js file in /build directory
  ]
};

module.exports = config;