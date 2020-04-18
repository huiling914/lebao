import request from '@/utils/request'

export function listRecharge(query) {
  return request({
    url: '/biz/trade/account/charge/list',
    method: 'get',
    params: query
  })
}
