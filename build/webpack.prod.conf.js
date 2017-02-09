var path = require('path')
var config = require('../config')
var utils = require('./utils')
var entry = require('./getentry')
var webpack = require('webpack')
/* 合并webpack配置 可以是array和object */
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.prod.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
// 合并公共代码
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var chunks = Object.keys(baseWebpackConfig.entry);
var prodConfig = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({ sourceMap: config.build.productionSourceMap, extract: true })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,

    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[id].chunk.js?[chunkhash]'
  },
  vue: {
    loaders: utils.cssLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_debugger: process.env.NODE_ENV === 'production',
        drop_console: process.env.NODE_ENV === 'production',
        // drop_debugger: false,
        // drop_console: false,
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    // new CommonsChunkPlugin({
    //     name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
    //     chunks: chunks,
    //     minChunks: chunks.length // 提取所有entry共同依赖的模块
    // }),
    // extract css into its own file
    new ExtractTextPlugin('static/css/[name].[contenthash].css'),
    new CommonsChunkPlugin({
      name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
      chunks: chunks,
      minChunks: chunks.length // 提取所有entry共同依赖的模块
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: process.env.NODE_ENV === 'testing'
    //     ? 'index.html'
    //     : config.build.index,
    //   template: 'index.html',
    //   inject: true,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeAttributeQuotes: true
    //     // more options:
    //     // https://github.com/kangax/html-minifier#options-quick-reference
    //   }
    // })
  ]
})
var page = Object.keys(entry.getEntry('src/view/*.html', 'src/view/'));
page.forEach(function(pathname) {
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
  prodConfig.plugins.push(new HtmlWebpackPlugin(conf));
});
module.exports = prodConfig;
