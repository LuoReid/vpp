'use strict'
module.exports = {
  publicPath:'/vpp/',
  lintOnSave: false,
  devServer: {
    port: 8085,
    open: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: `${process.env.VUE_APP_BASE_URL}`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  }
}