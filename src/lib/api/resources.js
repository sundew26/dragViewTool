// HTTP请求基类
import Vue from 'vue'
import VueResource from 'vue-resource'
import qs from 'qs'
import { cookieDomain, API_ROOT } from '../config'
import { getStorage } from '../utils/authService'
import { Buffer } from 'buffer'
import md5 from 'js-md5'
Vue.use(VueResource)
Vue.http.options.crossOrigin = true
Vue.http.options.xhr = {withCredentials: true}
// Vue.http.options.emulateJSON = true
let clientName = (navigator.userAgent.match(/(ipad|iPhone|iPod|Android|ios|Windows Phone|SymbianOS)/i)) ? 'wap' : 'web'
Vue.http.interceptors.push({
  request (request) {
    console.log(request)
    request.params = {...request.params, client: clientName}
    console.log(request.params)
    // get请求的所有内容都在url里面，约定contentLength是-1. 其它都认为是post请求
    var contentLength = -1
    if (request.method !== 'GET') {
      // Content-length的坑 由于中文问题 必须用buffer获取byte长度
      if (request.data !== '') { // 如果POST数据不是空，那么就重新根据数据类型，转换成字符串，然后计算。
        var dataLength = 0
        if (request.data instanceof Array) {
          // 数组类型的数据要转换成JSON字符串传递下去。
          request.data = JSON.stringify(request.data)
          dataLength = Buffer.byteLength(request.data, 'utf8')
          console.log('dataLength', dataLength)
        } else {
          // 对象类型的数据直接传递JSON对象，但是Buffer.byteLength计算函数只接受字符串类型的参数。
          dataLength = Buffer.byteLength(JSON.stringify(request.data), 'utf8')
          console.log('dataLength2', dataLength)
        }
        contentLength = dataLength
      } else { // 如果POST请求的内容为空，那么认为长度是0. 不参与以上计算过程，因为JSON.stringify('') = '""' 长度会变成2
        contentLength = 0
      }
    }
    let union = '?' // url与参数的连接符。默认是问号.
    if (request.url.indexOf('?') !== -1) { // 如果api接口请求url里面已经带了？参数
      union = '&' // 那么本次链接使用&符号链接参数。
    }
    let paramsStr = Object.keys(request.params).length !== 0 ? (union + qs.stringify(request.params)) : ''
    console.log('paramsStr', paramsStr)
    let url = request.url.replace('/api/', API_ROOT) + paramsStr
    let baseString = request.method + url + contentLength
    console.log('baseString', baseString)
    // 对请求头进行认证处理
    request.headers = request.headers || {}
    request.headers.sign = md5(baseString + cookieDomain)
    let userinfo
    if (window.location.href.indexOf('/kaiman') !== -1) {
      userinfo = getStorage('kmifu')
    } else {
      userinfo = getStorage('userinfo')
    }
    console.log('userinfo', userinfo)
    if (userinfo) {
      request.headers.auth = userinfo.id + ' ' + md5(baseString + userinfo.token)
    }
    request.headers['Cache-Control'] = 'no-cache'
    request.headers['If-Modified-Since'] = '0' // IE浏览器设置禁用缓存
    // if (request.url.indexOf('/user/tpLogin') !== -1) { // 临时登录代码。转换为标准form表单
    //   request.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    //   request.params = ''
    // }
    return request
  },
  response (response) {
    // 这里可以对响应的结果进行处理
    if (response.data.code === '200') {
      console.log('response', response)
    }
    return response
  }
})
// Api箭头函数
export const ApiResource = url => Vue.resource(url)
