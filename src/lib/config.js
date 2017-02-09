var defaultRootUrl
var API_ROOT
console.log('config-env', process.env.NODE_ENV)
// 正式环境
if (process.env.NODE_ENV === 'production') {
  // 默认跳转的网址
  defaultRootUrl = 'http://...'
  // API请求替换的网址
  API_ROOT = 'http://...'
} else if (process.env.NODE_ENV === 'test') {
  // 测试环境
  // 默认跳转的网址
  defaultRootUrl = 'http://...'
  // API请求替换的网址
  API_ROOT = 'http://...'
} else if (process.env.NODE_ENV === 'dev') {
  // 开发环境
  // 默认跳转的网址
  defaultRootUrl = 'http://...'
  // API请求替换的网址
  API_ROOT = 'http://...'
} else {

}
export { defaultRootUrl, API_ROOT }
// 请求签名是的秘药串
export const cookieDomain = 'www....'
// 默认视频封面
export const defaultVideoPoster = 'http://images....'
// 默认视频根地址
export const defaultVideoRoot = 'http://...'
// 默认图片根地址
export const defaultImageRoot = 'http://...'
// 默认头像
export const defaultAvatar = 'http://...'
// 视频上传的最大限制
export const videoMaxFileSize = '200mb'
// 视频上传的文件格式限制
export const videoFileMime = [
  {title: '视频格式', extensions: 'mp4'}
]
// 图片上传的最大限制
export const imageMaxFileSize = '2mb'
// 图片上传的最大限制
export const fileSize = '20mb'
// 图片上传文件格式限制
export const imageFileMime = [
  {title: '图片格式', extensions: 'jpg,png,gif,jpeg'}
]
// 图片上传文件格式限制
export const fileMime = [
  {title: '文件格式', extensions: 'doc,docx,xls,xlsx,pdf,png,jpg,jpeg'}
]
// 编辑器默认配置
export const defaultEditorSetting = {
  toolbar: {
    diffLeft: 20,
    diffTop: -40,
    buttons: [{
      name: 'bold',
      contentDefault: '加粗'
    }, {
      name: 'justifyLeft',
      contentDefault: '居左'
    }, {
      name: 'justifyCenter',
      contentDefault: '居中'
    }, {
      name: 'orderedlist',
      contentDefault: '有序排列'
    }, {
      name: 'unorderedlist',
      contentDefault: '无序排列'
    }, {
      name: 'quote',
      contentDefault: '引用'
    }, {
      name: 'anchor',
      contentDefault: '网址'
    }, {
      name: 'h3',
      contentDefault: '标题'
    }
    ]
  },
  anchor: {
    placeholderText: '请输入完整网址,包含http:// 或 https://'
  }
}

// 对宽度100%的图片进行压缩，换算方法
export const screen = window.screen.availWidth
export const tileHeight = Math.ceil(screen / 16 * 9)
export const imageView = 'imageView2/1/w/' + screen + '/h/' + tileHeight

