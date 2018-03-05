const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const pkg = require('../package.json');

module.exports = {
    entry: {
        index: "./src/index.js",
        // vendor: Object.keys(pkg.dependencies)
    },
    plugins: [
        new CleanWebpackPlugin(["dist"], {
            root: path.resolve(__dirname, "../"),
            verbose: true,
            dry: false
        }),
    ],
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "../dist"),
        publicPath: ""
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [ {
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                } ]
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.svg$/,
                use: {
                    loader: 'svg-url-loader',
                    options: {}
                }
            }
        ]
    }
};
