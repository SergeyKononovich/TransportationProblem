var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {
    devtool: 'eval-source-map',

    output: {
        path: './dist',
        publicPath: 'http://localhost:59974/dist/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [
      new ExtractTextPlugin('[name].css')
    ],

    devServer: {
        proxy: {
            '**': {
                target: 'http://localhost:59974',
                pathRewrite: { '.*': '/dist/index.html' }
            }
        },
        historyApiFallback: true,
        stats: 'minimal'
    }
});