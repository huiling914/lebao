import request from '@/utils/request'

export function listBrand(query) {
  return request({
    url: '/mall/admin/brand/list',
    method: 'get',
    params: query
  })
}

export function createBrand(data) {
  return request({
    url: '/mall/admin/brand/create',
    method: 'post',
    data
  })
}

export function readBrand(data) {
  return request({
    url: '/mall/admin/brand/read',
    method: 'get',
    data
  })
}

export function updateBrand(data) {
  return request({
    url: '/mall/admin/brand/update',
    method: 'post',
    data
  })
}

export function deleteBrand(data) {
  return request({
    url: '/mall/admin/brand/delete',
    method: 'post',
    data
  })
}

export function uploadBrandIcon(data) {
  return request({
    url: '/res/file/upload/uploadBrandIcon',
    method: 'post',
    headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
    data
  })
}
export function listBrandType(query) {
  return request({
    url: '/mall/admin/category/list',
    method: 'get',
    params: query
  })
}
