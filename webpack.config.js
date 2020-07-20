const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Store .html file names in src/ in an array
const ejsPages =
  fs
    .readdirSync(path.resolve(__dirname, 'src'))
    .filter(fileName => fileName.endsWith('.ejs'))
    .map(ejsPage => new HtmlWebpackPlugin({
      isProd: process.env.NODE_ENV === 'production',
      title: 'Moun Goonj',
      filename: ejsPage,
      template: `src/${ejsPage}`
    }))

module.exports = {
  mode: 'development',
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    openPage: '/index.ejs',
    hot: false,
    compress: true,
    port: 9000,
    stats: 'minimal',
  },
  module: {
    rules: [
      { 
        test: /\.pug$/,
        exclude: ['/node_modules/'],
        use: [{
          loader: 'pug-loader',
          options: {
            pretty: true,
            self: true,
          },
        }]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        "test": /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
        "loader": "url-loader",
        "options": {
          "name": "[name].[hash:20].[ext]",
          "limit": 10000
        }
      },
      {
        "test": /\.(eot|svg|cur)$/,
        "loader": "file-loader",
        "options": {
          "name": "[name].[hash:20].[ext]",
          "limit": 10000
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    ...ejsPages,
    new webpack.HotModuleReplacementPlugin(),
    // new HtmlWebpackPlugin({
    //   isProd: process.env.NODE_ENV === 'production',
    //   title: 'Moun Goonj',
    //   template: './src/index.ejs'
    // }),
    new CopyWebpackPlugin([
      {
        "context": "src",
        "to": "",
        "from": {
          "glob": "assets/**/*",
          "dot": true
        }
      },
      {
        "context": "src",
        "to": "",
        "from": {
          "glob": "favicon.ico",
          "dot": true
        }
      }
    ], {
      "ignore": [
        ".gitkeep",
        "**/.DS_Store",
        "**/Thumbs.db"
      ],
      "debug": "warning"
    })
  ]
};