const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    openPage: 'app.html',
    port: 8000,
    https: true,
    contentBase: './dist'
  }
});