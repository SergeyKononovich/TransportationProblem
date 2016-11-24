var webpack = require('webpack');
var WebpackNotifierPlugin = require('webpack-notifier');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helper = require('./webpack-helper');

module.exports = {
    entry: {
        'polyfills': './Site/polyfills.ts',
        'vendor': './Site/vendor.ts',
        'app': './Site/main.ts'
    },

    resolve: {
        modulesDirectories: ["web_modules", "node_modules"],
        extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html', '.xml', '.json', '.md']
    },

    node: {
        fs: 'empty',
        file: 'empty',
        directory: 'empty'
    },

    externals: [
        {
            './cptable': 'var cptable'
        }
    ],

    module: {
        loaders: [
            {
                test: /\.component\.ts$/,
                loaders: ['ts', 'angular2-template-loader'],
                exclude: [/\.(spec|e2e)\.ts$/]
            },
            {
                test: /\.ts$/,
                exclude: /\.component\.ts$/,
                loader: 'ts'
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=assets/images/[name].[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            },
            {
                test: /\.(woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=assets/fonts/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                exclude:  helper.root('Site', 'App'),
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
            },
            {
                test: /\.css$/,
                include:  helper.root('Site', 'App'),
                loader: 'raw'
            },
            {
                test: /\.scss$/,
                exclude: helper.root('Site', 'App'),
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap!resolve-url!sass?sourceMap')
            },
            {
                test: /\.scss$/,
                include: helper.root('Site', 'App'),
                loaders: ['exports-loader?module.exports.toString()', 'css?sourceMap', 'resolve-url', 'sass?sourceMap']
            },
            {
                test: /\.xml$/,
                loader: 'xml'
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.md$/,
                loader: 'md'
            }
        ]
    },

    plugins: [
        new WebpackNotifierPlugin(),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        new HtmlWebpackPlugin({
            template: 'Site/index.html'
        }),

        //new CopyWebpackPlugin([
        //    { from: 'Site/Content/Strings', to: 'assets/strings' }
        //], {
        //    // By default, we only copy modified files during 
        //    // a watch or webpack-dev-server build. Setting this 
        //    // to `true` copies all files. 
        //    copyUnmodified: true
        //})
    ]
};