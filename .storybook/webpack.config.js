const path = require('path');

module.exports = {
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
                test: /\.png$/,
                loader: "file-loader"
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
