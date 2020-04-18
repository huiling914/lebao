import request from '@/utils/request'

export function listCategory(query) {
  return request({
    url: '/mall/admin/category/list',
    method: 'get',
    params: query
  })
}

export function listCatL1() {
  return request({
    url: '/mall/admin/category/l1',
    method: 'get'
  })
}

export function createCategory(data) {
  return request({
    url: '/mall/admin/category/create',
    method: 'post',
    data
  })
}

export function readCategory(data) {
  return request({
    url: '/mall/admin/category/read',
    method: 'get',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/mall/admin/category/update',
    method: 'post',
    data
  })
}

export function deleteCategory(data) {
  return request({
    url: '/mall/admin/category/delete',
    method: 'post',
    data
  })
}