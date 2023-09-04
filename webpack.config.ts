import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

module.exports = {
  mode: "development",
  devServer: {
    static: "./dist"
  },
  entry: "./src/index.ts",
  output: {
    filename: "app.bundle.[hash].js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css?$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    alias: {
      "app": path.resolve(__dirname, "./src/app/"),
      "widgets": path.resolve(__dirname, "./src/widgets/"),
      "modules": path.resolve(__dirname, "./src/modules/"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "assets/**/*"
        }
      ]
    })
  ]
};
