const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

process.env.NODE_ENV = 'development';

var vevo = {
    PUBLIC_URL: "http://localhost:8080"
}


const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    optimization: {
        minimize: false,
    },

    mode: 'development',
    entry: {
        app: './src/index.js'
        //print: './src/print.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: true,
        contentBase: './public'
    },
    module: {

        rules: [

            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },

            {
                test: /\.(js|mjs|jsx)$/,
                include: "/var/www/html/calafrio/lerna-repo/packages/client/src",
                loader: require.resolve('babel-loader'),
            },


        ]
    },

    plugins: [
        /*
              new webpack.DefinePlugin({
                "process.env.NODE_ENV": "development",
                //"process.env.BABEL_ENV": JSON.stringify("development"),
             }),
             */
        new HtmlWebpackPlugin({
            inject: true,
            template: "public/index.html",
        }),
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, vevo),

        //new webpack.optimize.UglifyJsPlugin(),


        // new CleanWebpackPlugin(['public']),
        // new HtmlWebpackPlugin({
        //   title: 'Development'
        // })
    ],
    output: {
        publicPath: '/',

        filename: 'static/js/bundle.js',
        //filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public')
    }
};