const path = require('path')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const common = require('./webpack.config.common')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const name = require('../package.json').name

const production = {
  entry: path.resolve(__dirname, '../lib/index.js'),
  devtool: 'source-map',
  mode: 'production',
  optimization: {
    minimize: true,
  },
}

const plugins = []

if (process.env.npm_config_report) {
  plugins.push(new BundleAnalyzerPlugin())
}

module.exports = [
  merge(common, production, {
    plugins: plugins,
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: 'index.umd.js',
      libraryTarget: 'umd',
      library: name,
      umdNamedDefine: true,
    },
  }),
  merge(common, production, {
    externals: [nodeExternals()],
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: 'index.common.js',
      libraryTarget: 'commonjs2',
      library: name,
    },
  }),
]
