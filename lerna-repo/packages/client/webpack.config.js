const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

process.env.NODE_ENV = 'development';

var vevo = {

	PUBLIC_URL : "dddd"
}


const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
//const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {

 
		optimization:{
			minimize: false,
		},
 
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
        test: [ /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
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
            /*options: {
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
            },
            */
          },


    ]
},

    plugins: [/*
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
		filename: 'static/js/bundle.js',
      //filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'public')
    }
  };