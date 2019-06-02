const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
//const dependencies = Object.keys(require("./package.json").dependencies);

module.exports = {
  entry: {
    'PhotoBlock': path.join(__dirname, "src/packages/photoblock"),
    'EthereumContext': path.join(__dirname, "src/packages/contexts/ethereum"),
    'KlaytnContext': path.join(__dirname, "src/packages/contexts/klaytn"),
    'WebContext': path.join(__dirname, "src/packages/contexts/web"),
    'BitcoinContext': path.join(__dirname, "src/packages/contexts/bitcoin")
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].min.js",
    sourceMapFilename: "[name].min.js.map",
    library: "[name]",
    libraryExport: "default",
    libraryTarget: "var"
  },
 // externals: dependencies,
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
          {
            loader: 'file-loader', options: { name: 'img/[name].[ext]?[hash]' } 
          }
        ]
      },
      {
        test: /\.html$/,
        use: "html-loader",
        exclude: /node_modules/
      }
    ],
    noParse: [
      /[\\\/]tweetnacl[\\\/]/,
      /[\\\/]tweetnacl-auth[\\\/]/
    ]
  },
  plugins: [

    new CopyWebpackPlugin([
      { from: 'src/packages/photoblock/components/emoji/11/img', to: 'img' },
      { from: 'src/packages/photoblock/img', to: 'img' },
      { from: 'src/app/img/trycrypto.png', to: 'img' },
      { from: 'src/app/index.html' },
      { from: 'src/app/app.html' },
      { from: 'src/app/app.js' },
      { from: 'src/app/auth.html' },
      { from: 'src/app/auth.js' },
      { from: 'src/app/styles.css' },
      { from: 'src/packages/contexts/**/*.png', to: 'img/contexts', flatten: true }
    ])
  ],
  resolve: {
    extensions: [".js"]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    host: "0.0.0.0",
    stats: "minimal"
  }
};
