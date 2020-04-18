import request from '@/utils/request'

export function listUserVideo(query){
	return request({
		url:'/base/user/video/listAdmin',
		method:'get',
		params:query
	})
}
export function auditVideo(data){
	return request({
		url:'/base/user/video/audit ',
		method:'post',
		data
	})
}
export function auditComment(data){
	return request({
		url:'/base/user/video/auditComment',
		method:'post',
		data
	})
}
export function commentVideo(data){
	return request({
		url:'/base/user/video/comment',
		method:'post',
		data
	})
}