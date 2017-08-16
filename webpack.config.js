const path = require('path');
const webpack = require('webpack'); //to access built-in plugins like HMR
const HtmlWebpackPlugin = require('html-webpack-plugin'); //complies html on the fly from template
const ExtractTextPlugin = require("extract-text-webpack-plugin"); //extracts inline css and saves to a file
const bootStrapEntryPoints = require('./webpack.bootstrap.config');

const isProd = process.env.NODE_ENV ==='production'; //boolean value to set dev or prod mode, to determine webpack behavior for HMR/extract
//for dev, only use the loaders in cunjunction with HMR
const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
//for prod, use the extract text plugin
const cssProd = ExtractTextPlugin.extract({
  fallback: "style-loader",
  use: [
    'css-loader',
    'sass-loader'],
  publicPath: '/dist'
});

const cssConfig = isProd ? cssProd : cssDev;
const bootStrapConfig = isProd ? bootStrapEntryPoints.prod : bootStrapEntryPoints.dev;

//entry and output
const config = {
  entry: {
    app: './src/index.js',
    bootstrap: bootStrapConfig,
    contact: './src/contact.js'
  },
  output : {
    path: path.resolve(__dirname, 'dist'),
    filename : '[name].bundle.js'  //name comes from the entry object above; app or bootstrap or whatever
  },
  //loaders
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: cssConfig //no extract text plugin for dev, use HMR
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude : path.resolve(__dirname, 'node_modules')
      },
      { //this is used for loading image files into a given folder
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          //this is so it doesn't save the image as a hash but exactly the same, and so the html file will know where to point
          'file-loader?name=[name].[ext]&outputPath=images/',
          'image-webpack-loader' //image optimization
        ]
      }, //these are used for loading fonts from webpack, name specifies location in fonts folder
      { test: /\.(woff2?)$/, loader: 'url-loader?limit=10000&name=fonts/[name].ext' },
      { test: /\.(ttf|eot)$/, loader: 'file-loader?name=fonts/[name].ext' },
      { test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports-loader?jQuery=jquery' } //to use jquery

    ]
  },
  //webpack dev server
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port:9000,
    stats: "errors-only", //to only log errors on compile/restart
    //open: true, //will open a new window each time
    hot: true //to enable HMR
  },
  //plugins
  plugins: [
    new HtmlWebpackPlugin({
      title: "Main Project Page",
      //minify: {
      //collapseWhitespace: true
      //},
      hash:true, //creates a dynamically generated hash to determine if you are uploading the latest files
      template: './src/index.html',
      excludeChunks : ['contact'] //this stops the other JS and assets from being bundled
    }),
    new HtmlWebpackPlugin({
      title: "Contact Page",
      //minify: {
      //collapseWhitespace: true
      //},
      filename: 'contact.html',
      hash:true,
      template: './src/contact.html',
      chunks: ['contact']  //this tells webpack to include only the contact bundle
    }),
    new ExtractTextPlugin({ //this doesn't work with HMR, only in prod, 'name' is used to dynamically generate a css file in a css folder
      filename: '/css/[name].css',
      disable: !isProd, //enable extract text while in production mode
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin(), //enable HMR globally
    new webpack.NamedModulesPlugin()//prints more readable module names in the browser when HMR updates it... eg ./src/app.css


  ]

}

module.exports = config;
