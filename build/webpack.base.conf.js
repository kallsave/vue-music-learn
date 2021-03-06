'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const PreloadWebpackPlugin = require('preload-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    // 只有development用dev.assetsPublicPath
    publicPath: process.env.NODE_ENV === 'development'
      ? config.dev.assetsPublicPath
      : config.build.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', ' '],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      // 'vue$': 'vue/src/platforms/web/entry-runtime-with-compiler.js',
      // 'better-scroll$': 'better-scroll/src/index.js',
      'better-scroll$': resolve('lib/better-scroll/src/index.js'),
      'vue-lazyload$': resolve('lib/vue-lazyload/src/index.js'),
      '@': resolve('src'),
      // 'cube-ui': 'cube-ui/lib'
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/webpack-dev-server/client'),
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new PreloadWebpackPlugin({
      rel: 'prefetch',
      as(entry) {
        if (/\.css$/.test(entry)) {
          return 'style'
        }
        if (/\.woff$/.test(entry)) {
          return 'font'
        }
        if (/\.png$/.test(entry)) {
          return 'image'
        }
        return 'script'
      }
    }),
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
