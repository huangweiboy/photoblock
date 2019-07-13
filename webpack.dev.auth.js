const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    openPage: 'auth.html',
    port: 8001,
    host: 'ipfs.auth1.com',
    https: true,
    contentBase: './dist'
  }
});