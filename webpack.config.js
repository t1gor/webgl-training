const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const outputDirectory = "build";
const dir = process.cwd();

module.exports = (env, argv) => ({
  target: "web",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.glsl$/,
        use: {
          loader: "webpack-glsl-minify",
          options: {
            output: "source"
          }
        }
      }
    ]
  },
  entry: path.resolve(dir, "src/index.ts"),
  output: {
    filename: "[name].js",
    path: path.resolve(dir, outputDirectory),
    library: "WEBGL",
    globalObject: "window"
  },
  devtool: argv.mode === "development" ? "eval-cheap-module-source-map" : "source-map",
  devServer: {
    static: {
      directory: "public",
    },
    hot: true,
    liveReload: true,
    port: 9000,
  },
  optimization: {
    chunkIds: "deterministic",
    /**
     * This option is here to prevent Webpack from re-naming functions (like Space or Surface).
     * @link https://webpack.js.org/configuration/optimization/#optimizationconcatenatemodules
     */
    concatenateModules: false,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
          mangle: false,
          sourceMap: true,
        },
      })
    ],
  },
  resolve: {
    extensions: [ ".ts", ".js" ],
    roots: [
      path.resolve("./src")
    ]
  },
  plugins: [
    new CleanWebpackPlugin({}),
    new HtmlWebpackPlugin({
      inject: true,
      scriptLoading: "blocking",
      template: path.join(__dirname, "public/index.html"),
    }),
  ],
});
