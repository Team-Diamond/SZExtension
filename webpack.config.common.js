const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
  entry: {
    popup: './src/popup/index.js',
    content: './src/content/index.js',
    chrome: './src/chrome/index.js'
  },
plugins: [
    new CleanWebpackPlugin(['popup']),
    new HtmlWebpackPlugin({
      title: 'Minimum-Viable',
      filename: 'popup.html',
      template: './public/popup.html',
    }),
    new CleanWebpackPlugin(['content']),
    new HtmlWebpackPlugin({
      title: 'Minimum-Viable',
      filename: 'content.html',
      template: './public/content.html',
    }),
  ],
module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'es2015',
              'react',
            ],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'es2015',
              'react',
            ],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
};
