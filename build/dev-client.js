/* eslint-disable */
/* 用处: 支持w3c规范, 一个浏览器w3c eventsource的ployfill, 在不支持事件源的浏览器里添加填充策略支持
 shim: 一个库, 它将一个新的环境引入到一个旧的环境中, 而且仅靠旧环境中已有的手段实现
 polyfill: 一个用在浏览器API上的shim
 实现: 先检查浏览器是否支持某个api, 如果不支持就加载对应的polyfill
 一个很好的例子,旧的shim好比一面墙,这面墙有些裂缝,polyfill能把裂缝补好
 */
require('eventsource-polyfill')
/* 全站自动刷新
* client是前端静态资源
* server是后端文件 ,如express的js */
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')

hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
