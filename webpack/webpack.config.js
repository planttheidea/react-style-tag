'use strict';

const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve(__dirname, '..');

module.exports = {
  devtool: '#source-map',

  entry: [path.resolve(ROOT, 'src', 'index.js')],

  externals: ['react', 'react-dom'],

  mode: 'development',

  module: {
    rules: [
      {
        enforce: 'pre',
        include: [path.resolve(ROOT, 'src')],
        loader: 'eslint-loader',
        options: {
          emitError: true,
          failOnError: true,
          failOnWarning: true,
          formatter: require('eslint-friendly-formatter')
        },
        test: /\.js$/
      },
      {
        include: [path.resolve(ROOT, 'src'), /DEV_ONLY/],
        loader: 'babel-loader',
        test: /\.js$/
      }
    ]
  },

  output: {
    filename: 'react-style-tag.js',
    library: 'Style',
    libraryTarget: 'umd',
    path: path.resolve(ROOT, 'dist'),
    umdNamedDefine: true
  },

  plugins: [new webpack.EnvironmentPlugin(['NODE_ENV'])]
};
