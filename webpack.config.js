const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "src/docs"),
  output: {
    path: path.join(__dirname, "docs"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader?url=false"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.html$/,
        use: "html-loader",
        exclude: /node_modules/
      },
      {
        test: /[\\\/]tweetnacl[\\\/]/,
        use: 'exports-loader?window.nacl!imports-loader?this=>window,module=>{},require=>false'
      },
      {
          test: /[\\\/]tweetnacl-auth[\\\/]/,
          use: 'exports-loader?window.nacl.auth!imports-loader?this=>window,module=>{},require=>false'
      }
    ],
    noParse: [
      /[\\\/]tweetnacl[\\\/]/,
      /[\\\/]tweetnacl-auth[\\\/]/
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      template: path.join(__dirname, "src/docs/index.html")
    }),
    new CopyWebpackPlugin([
      { from: 'src/lib/components/emoji/11/img', to: 'img' },
      { from: 'src/lib/img', to: 'img' },
      { from: 'src/lib/img/contexts', to: 'img/contexts' }
    ])
  ],
  resolve: {
    extensions: [".js"]
  },
  devServer: {
    contentBase: path.join(__dirname, "docs"),
    host: "0.0.0.0",
    port: 8000,
    stats: "minimal"
  }
};
