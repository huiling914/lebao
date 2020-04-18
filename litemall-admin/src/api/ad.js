import request from '@/utils/request'

export function listAd(query) {
  return request({
    url: '/mall/admin/ad/list',
    method: 'get',
    params: query
  })
}
export function listLink(query) {
  return request({
    url: '/mall/admin/ad/listLink',
    method: 'get',
    params: query
  })
}
export function createAd(data) {
  return request({
    url: '/mall/admin/ad/create',
    method: 'post',
    data
  })
}

export function readAd(data) {
  return request({
    url: '/mall/admin/ad/read',
    method: 'get',
    data
  })
}

export function updateAd(data) {
  return request({
    url: '/mall/admin/ad/update',
    method: 'post',
    data
  })
}

export function deleteAd(query) {
  return request({
    url: '/mall/admin/ad/delete',
    method: 'get',
    params:query
  })
}
