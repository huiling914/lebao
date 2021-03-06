import request from '@/utils/request'

export function listTopic(query) {
  return request({
    url: '/mall/admin/topic/list',
    method: 'get',
    params: query
  })
}

export function createTopic(data) {
  return request({
    url: '/mall/admin/topic/create',
    method: 'post',
    data
  })
}

export function readTopic(data) {
  return request({
    url: '/mall/admin/topic/read',
    method: 'get',
    data
  })
}

export function updateTopic(data) {
  return request({
    url: '/mall/admin/topic/update',
    method: 'post',
    data
  })
}

export function deleteTopic(query) {
  return request({
    url: '/mall/admin/topic/delete',
    method: 'get',
    params:query
  })
}
