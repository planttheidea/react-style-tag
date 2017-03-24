'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');

const PORT = 3000;

module.exports = {
  cache: true,

  devServer: {
    contentBase: './dist',
    host: 'localhost',
    inline: true,
    lazy: false,
    noInfo: false,
    quiet: false,
    port: PORT,
    stats: {
      colors: true,
      progress: true
    }
  },

  devtool: '#source-map',

  entry: [
    path.resolve(__dirname, 'DEV_ONLY', 'App.js')
  ],

  module: {
    rules: [
      {
        enforce: 'pre',
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'eslint-loader',
        options: {
          configFile: '.eslintrc',
          failOnError: true,
          failOnWarning: false,
          formatter: eslintFriendlyFormatter
        },
        test: /\.js$/
      }, {
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'DEV_ONLY')
        ],
        loader: 'babel-loader',
        test: /\.js$/
      }
    ]
  },

  node: {
    fs: 'empty'
  },

  output: {
    filename: 'react-style-tag.js',
    library: 'ReactStyleTag',
    path: path.resolve(__dirname, 'dist'),
    publicPath: `http://localhost:${PORT}/`,
    umdNamedDefine: true
  },

  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ]),
    new HtmlWebpackPlugin()
  ]
};
