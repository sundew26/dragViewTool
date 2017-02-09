var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var config = require('../config')
var entry = require('./getentry')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})
console.log('=========当前运行环境:' + process.env.NODE_ENV + '=========')
var devConfig = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders()
  },
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  plugins: [
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // 将环境变量到处到外部 代码中
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),

  ]
})

var pages = Object.keys(entry.getEntry('src/view/*.html', 'src/view/'));
pages.forEach(function(pathname) {
  var conf = {
    filename: config.build.assetsRoot+'/view/' + pathname + '.html', //生成的html存放路径，相对于path
    template: 'src/view/' + pathname + '.html', //html模板路径
    inject: 'body',    //js插入的位置，true/'head'/'body'/false
    /*
     * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
     * 如在html标签属性上使用{{...}}表达式，所以很多情况下并不需要在此配置压缩项，
     * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
     * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
     */
    // minify: { //压缩HTML文件
    //     removeComments: true, //移除HTML中的注释
    //     collapseWhitespace: false //删除空白符与换行符
    // }
  };
  if (pathname in baseWebpackConfig.entry) {
    // conf.favicon = 'src/imgs/favicon.ico';
    conf.inject = 'body';
    conf.chunks = ['vendors', pathname];
    conf.hash = true;
  }
  devConfig.plugins.push(new HtmlWebpackPlugin(conf));
});

module.exports = devConfig;