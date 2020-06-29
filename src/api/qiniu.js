import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}
export function getImageUrl(id) {
  return request({
    url: 'file/' + id, // 假地址 自行替换
    method: 'get'
  })
}
