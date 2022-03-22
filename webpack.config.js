const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    web_push: path.resolve(__dirname, "./public/src/"), //public/src
    "firebase-messaging-sw": path.resolve(
      __dirname,
      "./public/firebase-messaging-sw.js"
    ),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack Boilerplate",
      template: path.resolve(__dirname, "./public/src/index.html"), // шаблон
      filename: "index.html", // название выходного файла
    }),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    extensions: [".js", ".css"],
  },
};
