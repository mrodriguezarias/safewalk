const path = require("path")
const HtmlWebPackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")
const TerserPlugin = require("terser-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const dotenv = require("dotenv").config({
  path: path.resolve(process.cwd(), `env/${process.env.NODE_ENV}.env`),
})

const commonConfig = {
  entry: path.join(process.cwd(), "./backend/src/index.js"),
  output: {
    path: path.join(process.cwd(), "./backend/build"),
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.join(process.cwd(), "./backend/assets/index.html"),
      filename: path.join(process.cwd(), "./backend/build/index.html"),
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.parsed),
    }),
  ],
  stats: {
    colors: true,
    hash: true,
    timings: true,
    assets: true,
    chunks: true,
    chunkModules: true,
    modules: true,
    children: true,
  },
  target: "web",
  node: {
    fs: "empty",
  },
}

const devConfig = {
  devtool: "inline-source-map",
  mode: "development",
  devServer: {
    contentBase: path.join(process.cwd(), "./backend/build"),
    disableHostCheck: true,
    hot: true,
    host: "0.0.0.0",
    port: 3500,
  },
}

const prodConfig = {
  devtool: "",
  mode: "production",
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor_app",
          chunks: "all",
          minChunks: 2,
        },
      },
    },
  },
}

const webpackConfig = {
  ...commonConfig,
  ...(["test", "prod"].includes(process.env.NODE_ENV) ? prodConfig : devConfig),
}

module.exports = webpackConfig
