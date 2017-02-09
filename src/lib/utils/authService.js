import secret from './aes.js'

// export function setStorage (key, data) {
//   return window.localStorage.setItem(key, window.JSON.stringify(data))
// }
// export function getStorage (key) {
//   return window.JSON.parse(window.localStorage.getItem(key))
// }
export function setStorage (key, data) {
  let str = window.JSON.stringify(data) // 将数据转换成字符串格式，
  let d = secret.encrypt(str) // 然后进行加密。
  return window.localStorage.setItem(key, d) // 存储加密后的内容
}
/**
 * @param  {[string]} key [要查询的字段]
 * @return {[object]}     [内容]
 */
export function getStorage (key) {
  let ls = window.localStorage.getItem(key) || '' // 得到本地存储的内容字符串. 本地如果没有存储，那么是空字符串
  // 3行兼容代码，如果本地存储的是明文。那么主动存储一下，把明文变成密文。
  if (ls.indexOf('token') !== -1 || ls.indexOf('http') !== -1) { // 是否是明文的判断方法。userinfo中的token关键字。回退url中的http关键字。
    let obj = window.JSON.parse(ls) // 先按原来的方式，转换内容成原文。
    setStorage(key, obj) // 主动使用新方法存储一下数据。
  }
  let d = secret.decrypt(ls) // 对密文字符串进行解密。
  if (!d) { // 非法的字符串解密的结果是空字符串 ''
    d = '""' // 为了window.JSON.parse能正常执行，转换下内容
  }
  // console.log('获取本地信息结果：', window.JSON.parse(d))
  return window.JSON.parse(d)
}
export function removeStorage (key) {
  return window.localStorage.removeItem(key)
}
