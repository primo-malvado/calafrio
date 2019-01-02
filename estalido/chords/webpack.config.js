const webpack = require('webpack');
module.exports = {
    entry: [ /*'babel-polyfill' ,*/ "./src/index.js"],
    output: {
        path: __dirname,
        filename: "bundle.js",
    },






  plugins: [


    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
     

  ],




    "module": {
        loaders: [{
            test: /\.css$/,
            loader: "style!css"
        }, {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: "babel",
            query: {
                presets: ["es2015"],
            },
        },],
    },
};