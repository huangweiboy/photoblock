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
      }
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
    port: 8000,
    stats: "minimal"
  }
};
