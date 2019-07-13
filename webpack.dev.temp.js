const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    openPage: 'auth.html',
    port: 8002,
    host: 'ipfs.auth2.com',
    https: true,
    contentBase: './dist'
  }
});