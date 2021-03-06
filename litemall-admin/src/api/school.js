import request from '@/utils/request'

export function listSchool(query) {
  return request({
    url: '/mall/admin/school/list',
    method: 'get',
    params: query
  })
}
export function AddSchool(data) {
  return request({
    url: '/mall/admin/school/create',
    method: 'post',
    data
  })
}
export function UpdateSchool(data) {
  return request({
    url: '/mall/admin/school/update',
    method: 'post',
    data
  })
}
export function DeleteSchool(query) {
  return request({
    url: '/mall/admin/school/delete',
    method: 'get',
    params:query
  })
}
export function listTeacher(query) {
  return request({
   // url: '/mall/admin/teacher/list',
    url: "/mall/admin/teacher/list",
    method: 'get',
    params: query
  })
}
export function AddTeacher(data) {
  return request({
    url: '/mall/admin/teacher/create',
    method: 'post',
    data
  })
}
export function UpdateTeacher(data) {
  return request({
    url: '/mall/admin/teacher/update',
    method: 'post',
    data
  })
}
export function DeleteTeacher(query) {
  return request({
    url: '/mall/admin/teacher/delete',
    method: 'get',
    params:query
  })
}
export function listClass(query) {
  return request({
    url: '/mall/admin/class/list',
    method: 'get',
    params: query
  })
}
export function AddClass(data) {
  return request({
    url: '/mall/admin/class/create',
    method: 'post',
    data
  })
}
export function UpdateClass(data) {
  return request({
    url: '/mall/admin/class/update',
    method: 'post',
    data
  })
}
export function DeleteClass(data) {
  return request({
    url: '/mall/admin/class/delete',
    method: 'post',
    data
  })
}
export function listSchoolType(query) {
  return request({
    url: '/mall/admin/category/list',
    method: 'get',
    params:query
  })
}
export function schoolDetail(query) {
  return request({
    url: '/mall/admin/school/read/'+query,
    method: 'get',

  })
}
export function teacherDetail(query) {
  return request({
    url: '/mall/admin/teacher/read/'+query,
    method: 'get',

  })
}
export function classDetail(query) {
  return request({
    url: '/mall/admin/class/read/'+query,
    method: 'get',

  })
}
//常用学生
export function listStudent(query) {
  return request({
    url: '/base/user/favorStu/list',
    method: 'get',
    params:query

  })
}
//专家列表
export function listExpert(query){
  return request({
    url:'/mall/admin/expert/list',
    method:'get',
    params:query

  })
}
//添加专家
export function addExpert(data){
  return request({
    url:'/mall/admin/expert/add',
    method:'post',
    data

  })
}
//编辑专家信息
export function editExpert(data){
  return request({
    url:'/mall/admin/expert/edit',
    method:'post',
    data

  })
}
//删除专家信息
export function deleteExpert(query){
  return request({
    url:'/mall/admin/expert/del',
    method:'get',
    params:query
  })
}
//获取录播课程
export function listPayClass(query){
  return request({
    url:'/biz/trade/course/video/list',
    method:'get',
    params:query
  })
}
//获取录播课程类别
export function listClassType(query){
  return request({
    url:'/mall/admin/lebaoCategory/query',
    method:'get',
    params:query
  })
  
}
export function addPayClass(data){
  return request({
    url:'/biz/trade/course/video/add',
    method:'post',
    data
  })
  
}
export function updatePayClass(data){
  return request({
    url:'/biz/trade/course/video/edit',
    method:'post',
    data
  })
  
}
export function readPayClass(id){
  return request({
    url:'/biz/trade/course/video/read/'+id,
    method:'get'
  })
}
export function deletePayClass(query){
  return request({
    url:'/biz/trade/course/video/del',
    method:'get',
    params:query
  })
}
export function listVideos(id){
  return request({
    url:'/biz/trade/course/video/item/list/'+id,
    method:'get'
  })
}
export function addPayVideo(data){
  return request({
    url:'/biz/trade/course/video/item/add',
    method:'post',
    data
  })
}
export function updatePayVideo(data){
  return request({
    url:'/biz/trade/course/video/item/edit',
    method:'post',
    data
  })
}
export function deletePayVideo(query){
  return request({
    url:'/biz/trade/course/video/item/del',
    method:'get',
    params:query
  })
}
export function readPayVideo(query){
  return request({
    url:'/biz/trade/course/video/item/read/'+query,
    method:'get',

    
  })
}
export function playVideo(query){
  return request({
    url:'/res/file/oss/getUrl',
    method:'get',
    params:query
  })
}
export function listClassOrder(query){
  return request({
    url:'/biz/trade/order/course/list',
    method:'get',
    params:query
  })
}
export function readClassOrder(query){
  return request({
    url:'/biz/trade/order/course/read/'+query,
    method:'get',
    
  })
}
//公立学校
export function listPubSchool(query){
  return request({
    url:'/mall/admin/pub/school/list',
    method:'get',
    params:query
  })
}
export function readPubSchool(query){
  return request({
    url:'/mall/admin/pub/school/read/'+query,
    method:'get'
    
  })
}
export function createPubSchool(data){
  return request({
    url:'/mall/admin/pub/school/add',
    method:'post',
    data
  })
}
export function updatePubSchool(data){
  return request({
    url:'/mall/admin/pub/school/edit',
    method:'post',
    data
  })
}
export function deletePubSchool(query){
  return request({
    url:'/mall/admin/pub/school/del',
    method:'get',
    params:query
    
  })
}