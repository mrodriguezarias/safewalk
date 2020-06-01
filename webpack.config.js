const path = require("path")
const HtmlWebPackPlugin = require("html-webpack-plugin")
const Dotenv = require("dotenv-webpack")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

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
    new Dotenv({
      path: path.resolve(process.cwd(), `env/${process.env.NODE_ENV}.env`),
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
}

const devConfig = {
  devtool: "inline-source-map",
  mode: "development",
  devServer: {
    contentBase: path.join(process.cwd(), "./backend/build"),
    hot: true,
    port: 3500,
  },
}

const prodConfig = {
  devtool: "",
  mode: "production",
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            inline: false,
          },
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
  ...(process.env.NODE_ENV === "production" ? prodConfig : devConfig),
}

module.exports = webpackConfig
