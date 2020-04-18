import request from '@/utils/request'


export function listGroupon(query) {
  return request({
    url: '/biz/trade/groupon/found/list',
    method: 'get',
    params: query
  })
}
export function readGroupon(query) {
  return request({
    url: '/biz/trade/groupon/found/read/'+query,
    method: 'get'
    
  })
}
export function deleteGroupon(data) {
  return request({
    url: '/mall/admin/groupon/delete',
    method: 'post',
    data
  })
}

export function publishGroupon(data) {
  return request({
    url: '/mall/admin/groupon/create',
    method: 'post',
    data
  })
}

export function editGroupon(data) {
  return request({
    url: '/mall/admin/groupon/update',
    method: 'post',
    data
  })
}
export function listActivity(query) {
  return request({
    url: '/biz/trade/groupon/act/list',
    method: 'get',
    params: query
  })
}
export function addActivity(data){
  return request({
    url:'/biz/trade/groupon/act/add',
    method:'post',
    data
  })
}
export function readActivity(query){
  return request({
    url:'/biz/trade/groupon/act/read/'+query,
    method:'get',
    
  })
}
export function updateActivity(data){
  return request({
    url:'/biz/trade/groupon/act/edit',
    method:'post',
    data
  })
}
export function deleteActivity(query) {
  return request({
    url: '/biz/trade/groupon/act/del',
    method: 'get',
    params: query
  })
}