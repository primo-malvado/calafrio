let path = require('path');
module.exports = {
    entry: {
        comp_index: ['./src/client/index.js'],
        //        comp_lexer: ['./src/client/lexer.js'],
        //        comp_teste: ['./src/client/teste.js']
        comp_simplify: ['./src/client/simplify.js']
    },
    output: {
        path: path.resolve(__dirname, 'static/assets'),
        publicPath: '/assets/',
        filename: '[name].js'
    },

    module: {

        loaders: [
        /*
            {
                test: /\.txt$/,
                loader: 'raw-loader',
                exclude: /(node_modules)/
            },


            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                exclude: /(node_modules)/
            },
          */
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/
            }

        ]
    }

};
