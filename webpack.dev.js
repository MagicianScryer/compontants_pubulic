const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const packageJson = require("./package.json");
const path = require('path');

module.exports = {
  entry: ['./pages/index'],
  mode: 'development',
  target: 'web',
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    port: 3100,
    open: true,
    hot: true
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.tsx', '.ts'],
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@i18n': path.resolve(__dirname, 'i18n'),
      '@commons': path.resolve(__dirname, 'commons'),
      '@components': path.resolve(__dirname, 'components'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@styles': path.resolve(__dirname, 'styles')
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    clean: true,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: require.resolve('style-loader')
          },
          {
            loader: require.resolve('css-loader'),
            options: {
              sourceMap: true,
            },
          },
          {
            loader: require.resolve('sass-loader'),
            options: {
              sourceMap: true,
            },
          }
        ],
      },
      {
        test: /\.(tsx|ts|jsx|js)$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                [
                  '@babel/preset-react',
                  {
                    'runtime': 'automatic'
                  }
                ],
                '@babel/preset-typescript'
              ]
            }
          }
        ],
      },
      {
        exclude: /node_modules/,
        test: /\.(png|jpe?g|gif|svg|webp)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024
          }
        }
      },
      {
        exclude: /node_modules/,
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'dist/index.html'),
      template: path.resolve(__dirname, 'public/index.html'),
      favicon: path.resolve(__dirname, 'public/favicon.ico')
    })
  ]
};
