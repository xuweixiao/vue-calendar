
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}
const debugUrl = process.env.NODE_ENV === 'production' ? 'https://prod-baidu.com' : 'https://test-baidu.com'

module.exports = {
  pages: {
    // web端
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html'
    },
    // app端
    app: {
      // entry for the page
      entry: 'src/appModules/main.js',
      // the source template
      template: 'public/app.html',
      // output as dist/index.html
      filename: 'app.html'
    }
  },
  lintOnSave: true,
  // 链式操作
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
  },
  configureWebpack: config => {
    console.warn('\nwebpack---begin')
    if (process.env.NODE_ENV === 'production') {
      // 生产环境
      console.log('\n生产模式下：', debugUrl, '\n生产模式下环境变量：', process.env.name, process.env.auth)
    } else {
      // 开发环境
      console.log('\n开发模式下：', debugUrl, '\n开发模式下环境变量：', process.env.name)
    }
    console.log('webpack---end')
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
