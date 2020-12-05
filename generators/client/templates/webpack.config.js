const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDevelopment = (process.env.NODE_ENV || "development") === "development";

const initialEntryPoints = isDevelopment ? ["webpack-hot-middleware/client?reload=true"] : [];

let reactDomAlias = {};
if (isDevelopment) {
  reactDomAlias = {
    "react-dom": "@hot-loader/react-dom",
  };
}
module.exports = {
  entry: [...initialEntryPoints, path.join(__dirname, "./src/main.js")],
  context: path.resolve(__dirname),
  devtool: isDevelopment ? "source-map" : false,
  mode: isDevelopment ? "development" : "production",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? "[name].css" : "[name].[hash].css",
      chunkFilename: isDevelopment ? "[id].css" : "[id].[hash].css",
    }),
    new HtmlWebpackPlugin({
      title: "Engage",
      template: path.join(__dirname, "public/index.template.html"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"], cwd: path.resolve(__dirname) },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
      },
      {
        test: /\.module\.s(a|c)ss$/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: isDevelopment,
              esModule: true,
              hmr: isDevelopment,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      ...reactDomAlias,
      "@Components": path.resolve(__dirname, "src/components/"),
      "@Providers": path.resolve(__dirname, "src/providers/"),
    },
    extensions: ["*", ".js", ".scss"],
  },
  output: {
    path: path.resolve(__dirname, "../server/public/dist"),
    publicPath: "/dist/",
    filename: "bundle.js",
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    historyApiFallback: true,
    port: 3000,
    publicPath: "http://localhost:3000/dist/",
    hotOnly: true,
    proxy: [
      {
        context: ["/auth", "/api"],
        target: "http://localhost:4000",
      },
    ],
  },
};
