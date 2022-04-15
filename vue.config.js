const { defineConfig } = require('@vue/cli-service')
const path = require('path')//导入路径

module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      // 那些文件自动引入，要绝对路径
      patterns: [
        path.join(__dirname, './src/assets/styles/variable.less'),
        path.join(__dirname, './src/assets/styles/mix.less')
      ]
    },
    // 把10kb以下的图片都编码成base64方便数据网路条件下的加载效果
    chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10000 }))
   }
  }
})
