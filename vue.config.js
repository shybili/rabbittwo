const { defineConfig } = require('@vue/cli-service')
const path = require('path')//导入路径

module.exports = defineConfig({
  transpileDependencies: true, 

  // 这个是给webpack-dev-server开启可IP和域名访问权限。
  // chainWebpack: config => {
  //   config.devServer.allowedHosts('all')
  // },

    devServer:{
      host:"0.0.0.0",  
      allowedHosts:'all'
    },
      
    configureWebpack: {
      externals: {
        qc: 'QC'
      }
    },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      // 那些文件自动引入，要绝对路径
      patterns: [
        path.join(__dirname, './src/assets/styles/variable.less'),
        path.join(__dirname, './src/assets/styles/mix.less')
      ]
    },
  }
 })




