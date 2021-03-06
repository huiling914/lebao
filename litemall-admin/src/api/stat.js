import request from '@/utils/request'

export function statUser(query) {
  return request({
    url: '/mall/admin/stat/user',
    method: 'get',
    params: query
  })
}

export function statOrder(query) {
  return request({
    url: '/mall/admin/stat/order',
    method: 'get',
    params: query
  })
}

export function statGoods(query) {
  return request({
    url: '/mall/admin/stat/goods',
    method: 'get',
    params: query
  })
}
//查看对账单
export function statBillVerify(query) {
  return request({
    url: '/biz/trade/bill/verify/detail',
    method: 'get',
    params: query
  })
}
//查看资金流水账单
export function statBillFundflow(query) {
  return request({
    url: '/biz/trade/bill/verify/fundflow',
    method: 'get',
    params: query
  })
}
//查看充值异常记录
export function statBillError(query) {
  return request({
    url: '/biz/trade/bill/verify/list',
    method: 'get',
    params: query
  })
}

