// 本文件只做返回请求结果 不对结果进行任何处理
import { ApiResource } from './resources'
// 删除信息
export const deleteInfo = data => ApiResource('/api/info/deleteInfo').remove()
// 保存信息
export const saveInfo = data => ApiResource('/api/info/saveInfo').save({...data})
// 获取信息
export const getInfo = data => ApiResource('/api/info/getInfo').get({...data})
