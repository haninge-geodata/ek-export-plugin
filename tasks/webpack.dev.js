const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = merge(common, {
  output: {
    path: `${__dirname}/../../EK-extern-master/plugins`,
    publicPath: '/build/js',
    filename: 'origoexportetuna.js',
    libraryTarget: 'var',
    libraryExport: 'default',
    library: 'Origoexportetuna'
  },
  mode: 'development',
  module: {
  },
  plugins: [
    new WriteFilePlugin()
  ],
  devServer: {
    contentBase: './',
    port: 9009
  }
});
