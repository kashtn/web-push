const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    main: path.resolve(__dirname, "./main.js"), //public/src
    "firebase-messaging-sw": path.resolve(
      __dirname,
      "./firebase-messaging-sw.js"
    ),
  },
  output: {
    path: path.resolve(__dirname, "./docs"),
    filename: "[name].js",
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   title: "webpack Boilerplate",
    //   template: path.resolve(__dirname, "./public/index.html"), // шаблон
    //   filename: "index.html", // название выходного файла
    // }),
    // new CleanWebpackPlugin(),
  ],
  resolve: {
    extensions: [".js", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
