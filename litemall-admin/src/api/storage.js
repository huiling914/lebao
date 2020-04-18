import request from '@/utils/request'

export function listStorage(query) {
  return request({
    url: '/mall/admin/storage/list',
    method: 'get',
    params: query
  })
}

export function createStorage(data) {
  return request({
    url: '/mall/admin/storage/create',
    method: 'post',
    data
  })
}

export function readStorage(data) {
  return request({
    url: '/mall/admin/storage/read',
    method: 'get',
    data
  })
}

export function updateStorage(data) {
  return request({
    url: '/mall/admin/storage/update',
    method: 'post',
    data
  })
}

export function deleteStorage(data) {
  return request({
    url: '/mall/admin/storage/delete',
    method: 'post',
    data
  })
}

const uploadPath = '/mall/admin/storage/create'
export { uploadPath }

const uploadHeaderPath = 'http://www.lebao108.com/images/'
export { uploadHeaderPath }
