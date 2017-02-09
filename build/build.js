// https://github.com/shelljs/shelljs
// 在保留shell脚本(命令)的基础上,消除其对unix的依赖    global全局使用
require('shelljs/global')
console.log('=========当前打包环境:' + process.env.NODE_ENV + '=========')
console.log('=========当前打包全部内容，时间会比较长哦=========')
env.NODE_ENV = process.env.NODE_ENV

var path = require('path')
var config = require('../config')
// 终端精致的旋转loading...插件
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')

// console.log(
//   '  Tip:\n' +
//   '  Built files are meant to be served over an HTTP server.\n' +
//   '  Opening index.html over file:// won\'t work.\n'
// )

var spinner = ora('生产中...')
spinner.start()

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
// 不要删除旧文件了
// rm('-rf', assetsPath)
// 确保目录存在, 如果不存在, 就新建一个
mkdir('-p', assetsPath)
// copy所有目录文件及其子目录文件. 不加r/R的 只copy文件 不copy目录,  -r反序
cp('-R', 'static/', assetsPath)

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
})
