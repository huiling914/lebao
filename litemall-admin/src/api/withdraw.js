import request from '@/utils/request'
//获取提现记录
export function listWithdraw(query) {
  return request({
    url: '/biz/trade/withdraw/list',
    method: 'get',
    params: query
  })
}
//提现审核
export function auditWithdraw(query) {
  return request({
    url: '/biz/trade/withdraw/audit',
    method: 'post',
    data: query
  })
}
//提现审核
export function confirmWithdraw(query) {
  return request({
    url: '/biz/trade/withdraw/confirm',
    method: 'post',
    data: query
  })
}
