import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/mall/admin/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}
