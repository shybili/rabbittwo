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
    }
  }
})
