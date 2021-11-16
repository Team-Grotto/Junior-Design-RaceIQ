const webpack = require('webpack'); // only add this if you don't have yet

// replace accordingly './.env' with the path of your .env file 
require('dotenv').config({ path: './.env' }); 

const HtmlWebPackPlugin = require("html-webpack-plugin");
const htmlPlugin = new HtmlWebPackPlugin({
 template: "./src/index.html",
 filename: "./index.html"
});
module.exports = {
mode: 'development',
  module: {
    rules: [{
   test: /\.js$/,
   exclude: /node_modules/,
   use: {
     loader: "babel-loader"
   }
 },
  {
   test: /\.css$/,
   use: ["style-loader", "css-loader"]
  }
]},
 plugins: [
   htmlPlugin,
   new webpack.DefinePlugin({
    "process.env": JSON.stringify(process.env)
   }),
  ]
};