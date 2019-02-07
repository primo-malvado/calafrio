process.env.NODE_ENV = 'developement';


const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
//const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: {
		app: './src/index.js'
      	//print: './src/print.js'
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './public'
	},
	module: {
  
    rules: [

          {
            test: /\.(js)$/,
            //include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
            	/*
              customize: require.resolve(
                'babel-preset-react-app/webpack-overrides'
              ),
              
              plugins: [
                [
                  require.resolve('babel-plugin-named-asset-import'),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
                      },
                    },
                  },
                ],
              ],
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              // Don't waste time on Gzipping the cache
              cacheCompression: false,
              */
            },
          },


    ]
},

    plugins: [
     	new webpack.DefinePlugin({
     		"process.env.NODE_ENV": JSON.stringify("development"),
     		"process.env.BABEL_ENV": JSON.stringify("development"),
 		 }),
	    new HtmlWebpackPlugin({
	      inject: true,
	      template: "public/index.html",
	    }),



     // new CleanWebpackPlugin(['public']),
     // new HtmlWebpackPlugin({
     //   title: 'Development'
     // })
    ],
    output: {
		filename: 'static/js/bundle.js',
      //filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'public')
    }
  };