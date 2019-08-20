const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    openPage: 'auth.html',
    host: 'ipfs1.auth1.com',
    port: 8001,
    https: true,
    contentBase: './dist',
    disableHostCheck: true
  }
});