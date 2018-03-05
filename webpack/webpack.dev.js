const merge = require("webpack-merge");
const config = require("./webpack.config.js");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

module.exports = merge(config, {
    devtool: "inline-source-map",
    plugins: [
        // new BundleAnalyzerPlugin(), // Uncomment to see package sizes
        new WebpackBuildNotifierPlugin({
            title: "Chrome Web Share",
            sound: false
        })
    ],
    mode: 'development'
});
