import request from '@/utils/request'
import Qs from 'qs'

export function listOrder(query) {
  return request({
    url: '/biz/trade/order/course/list',
    method: 'get',
    params: query,
    paramsSerializer: function(params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

export function detailOrder(id) {
  return request({
    url: '/biz/trade/order/course/read/'+id,
    method: 'get',
    
  })
}
export function detailSchoolOrder(id) {
  return request({
    url: '/biz/trade/order/consume/read/'+id,
    method: 'get'
    
    
  })
}
export function shipOrder(data) {
  return request({
    url: '/mall/admin/order/ship',
    method: 'post',
    data
  })
}

export function refundOrder(data) {
  return request({
    url: '/mall/admin/order/refund',
    method: 'post',
    data
  })
}

export function replyComment(data) {
  return request({
    url: '/mall/admin/order/reply',
    method: 'post',
    data
  })
}
export function refundList(query) {
  return request({
    url: '/biz/trade/refund/course/list',
    method: 'get',
    params:query,
    paramsSerializer: function(params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
export function detailRefund(id) {
  return request({
    url: '/biz/trade/refund/course/read/'+id,
    method: 'get',
    
  })
}
export function feedBack(data) {
  return request({
    url: '/biz/trade/refund/check',
    method: 'post',
    data
  })
}
export function auditRefund(data) {
  return request({
    url: '/biz/trade/refund/course/audit',
    method: 'post',
    data
  })
}
export function confirmRefund(data) {
  return request({
    url: '/biz/trade/refund/course/confirm',
    method: 'post',
    data
  })
}