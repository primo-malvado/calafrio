let path = require('path');
module.exports = {

    devServer: {

        contentBase: path.join(__dirname, 'static'),
        compress: true,
        port: 9000
    },


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

        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }

                }
            }
        ]
    }


};
