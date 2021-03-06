import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/base/user/account/list',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/mall/admin/user/create',
    method: 'post',
    data
  })
}

export function readUser(data) {
  return request({
    url: '/mall/admin/user/detail',
    method: 'get',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/base/user/account/update',
    method: 'post',
    data:data
  })
}

export function listAddress(query) {
  return request({
    url: '/mall/admin/address/list',
    method: 'get',
    params: query
  })
}

export function listCollect(query) {
  return request({
    url: '/mall/admin/collect/list',
    method: 'get',
    params: query
  })
}

export function listFeedback(query) {
  return request({
    url: '/mall/admin/feedback/list',
    method: 'get',
    params: query
  })
}

export function listFootprint(query) {
  return request({
    url: '/mall/admin/footprint/list',
    method: 'get',
    params: query
  })
}

export function listHistory(query) {
  return request({
    url: '/mall/admin/history/list',
    method: 'get',
    params: query
  })
}

export function getfavorStu(query) {
  return request({
    url: '/base/user/favorStu/adminList',
    method: 'get',
    params:query
  })
}