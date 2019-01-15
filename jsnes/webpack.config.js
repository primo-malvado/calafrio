var path = require("path");
var webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    "jsnes": "./src/index.js",
    //"jsnes.min": "./src/index.js",
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: "jsnes",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
 
module: {
  rules: [
    {
      test: /\.m?js$/,
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
 
   ,
  plugins: [
  /*  new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      sourceMap: true
    })
    */
  ]
};
