const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

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
  devServer: {
    static: './',
    port: 9008,
    devMiddleware: {
      //index: true,
      //mimeTypes: { 'text/html': ['phtml'] },
      //publicPath: '/publicPathForDevServe',
      //serverSideRender: true,
      writeToDisk: true
    },
    
  }
});
