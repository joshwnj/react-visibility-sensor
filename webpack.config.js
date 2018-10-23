const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = env => {
  let entry;
  let output;

  let externals = {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "ReactDOM",
      root: "ReactDOM"
    }
  };

  if (env === "production") {
    entry = {
      "visibility-sensor": "./visibility-sensor.js",
      "visibility-sensor.min": "./visibility-sensor.js"
    };

    output = {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
      library: "react-visibility-sensor",
      libraryTarget: "umd",
      globalObject: "this"
    };
  }

  if (env === "test") {
    entry = {
      bundle: "./tests/visibility-sensor-spec.jsx"
    };

    output = {
      path: path.resolve(__dirname, "tests"),
      filename: "[name].js"
    };

    // we want React, ReactDOM included in the test bundle
    externals = {};
  }

  if (env === "example") {
    entry = {
      bundle: "./example/main.js"
    };

    output = {
      path: path.resolve(__dirname, "example/dist"),
      filename: "[name].js"
    };

    // we want React, ReactDOM included in the example bundle
    externals = {};
  }

  return {
    mode: "production",
    entry: entry,
    output: output,
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          test: /\.min.js($|\?)/i
        })
      ]
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    resolve: {
      alias: {
        react: path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom")
      },
      extensions: [".js", ".jsx"]
    },
    externals: externals
  };
};
