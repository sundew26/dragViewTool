/*
* author: luwei
* date: 2016.09.26
* func: 1. 模式选择 prompt
*       2. 路由代理 http-proxy-middleware
*       3. 热部署 webpack-hot-middleware
 *      4. 监听8080端口 */
console.log('=========当前运行的环境:' + process.env.NODE_ENV + '=========')
console.log('=========当前命令是开发模式，请选择文件监听模式=========')
console.log('------1.输入1 监听全部文件------')
console.log('------2.输入2 按照根目录下config.js里配置的文件 \n 进行监听（模式2 页面刷新以及性能比较高）------')
/* node 命令行输入控件
* 参考: http://npm.taobao.org/package/prompt*/
var prompt = require('prompt');
// 输入配置
var schema = {
  properties: {
    model: {
      message: '请选择模式 1 OR 2 \n',
      required: true
    }
  }
};
// 开始监听输入
prompt.start();
var devModel;
//得到输入的内容，进行下一步处理
prompt.get(schema, function (err, result) {
  console.log('您当前输入的模式为==> 模式' + result.model);
  // 将当前输入的传给unitconfig
  devModel = result.model;
  module.exports = devModel;
  // 传入之后在引入，不然会导致undefined
  var path = require('path')
  /*Express本质是一系列middleware的集合*/
  var express = require('express')
  var webpack = require('webpack')
  var config = require('../config')
  /* Node.js 代理中间件 for connect, express 和 browser-sync
  * https://github.com/chimurai/http-proxy-middleware */
  var proxyMiddleware = require('http-proxy-middleware')
  var webpackConfig = process.env.NODE_ENV === 'testing' ? require('./webpack.prod.conf') : require('./webpack.dev.conf')
  // 开发服务器监听的默认端口号
  var port = process.env.PORT || config.dev.port
  // 定义HTTP代理到自定义的API后端
  // https://github.com/chimurai/http-proxy-middleware
  var proxyTable = config.dev.proxyTable
  var app = express()
  var compiler = webpack(webpackConfig)
  /* 组织包装webpack的中间件.
    nodejs代理变得简单, 使得connect,express,browser-sync等的配置变得更简单的**代理中间件**
   参考: http://npm.taobao.org/package/webpack-dev-middleware */
  var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  })
  /* 热部署
  * 参考: http://npm.taobao.org/package/webpack-hot-middleware*/
  var hotMiddleware = require('webpack-hot-middleware')(compiler)
  // force page reload when html-webpack-plugin template changes
  compiler.plugin('compilation', function(compilation) {
    /*html-webpack-plugin不用使inject模式没有md5，而且不支持文件内联
     html-webpack-plugin-after-emit 允许其它插件去使用执行事件
     */
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
      hotMiddleware.publish({ action: 'reload' })
      cb()
    })
  })

  // proxy api requests
  Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
      options = { target: options }
    }
    app.use(proxyMiddleware(context, options))
  })
  // app.use(proxyMiddleware('/api/**', {
  //         target: 'http://test.kaistart.net:8080',
  //         // changeOrigin: true, // for vhosted sites, changes host header to match to target's host
  //         logLevel: 'debug'
  //     }))
  // handle fallback for HTML5 history API  回退功能
  app.use(require('connect-history-api-fallback')())

  // serve webpack bundle output
  app.use(devMiddleware)

  // enable hot-reload and state-preserving
  // compilation error display
  app.use(hotMiddleware)

  // serve pure static assets
  var staticPath = path.posix.join(config.build.assetsPublicPath, config.build.assetsSubDirectory)
  // 将静态文件目录设置为/static
  app.use(staticPath, express.static('./static'))
  module.exports = app.listen(port, function(err) {
    if (err) {
      console.log(err)
      return
    }
    console.log('Listening at http://localhost:' + port + '\n')
  })
});
