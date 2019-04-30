
const path = require('path')
const webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, dir)
}
const envStr = process.env.env
const debugUrl = (envStr === 'dev') ? 'https://dev-baidu.com' : (envStr === 'prod') ? 'https://baidu.com' : 'https://test-baidu.com'

module.exports = {
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html'
    }
  },
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
  },
  configureWebpack: {
    optimization: {
      minimizer: [
      ]
    },
    plugins: [
      new webpack.DefinePlugin(
        {
          'envStr': JSON.stringify(envStr)
        }
      )
    ]
  },
  devServer: {
    port: 5200,
    proxy: {
      '/*.json': {
        target: debugUrl
      },
      '/*.do': {
        target: debugUrl
      },
      '/*.m': {
        target: debugUrl
      }
    }
  }
}
