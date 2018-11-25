// webpack only builds client code
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var APP = path.resolve(__dirname, 'src');
var BUILD = path.resolve(__dirname, 'build');
const webpack = require('webpack'); // remember to require this, because we DefinePlugin is a webpack plugin

// var config = (env) ={
    module.exports = () => {
        return {
  // webpack output
  node: {
  fs: 'empty'
},
  mode: 'production',
  entry: [
    APP + '/index.js',
    'webpack-dev-server/client?http://0.0.0.0:80',
  ],
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
    // new webpack.DefinePlugin(envKeys),
    new webpack.EnvironmentPlugin(),
    new CopyWebpackPlugin([
        { from: './public', to: 'public', force: true }
      ]),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
    }) // generates the index.js file in /build directory
  ]
};
    }
// module.exports = config;