import request from '@/utils/request'

//获取导学类别
export function listGuideType(query){
  return request({
    url:'/mall/admin/lebaoCategory/query',
    method:'get',
    params:query
  })  
}
export function listQues(query){
	return request({
		url:'/biz/trade/guidance/listWeb',
		method:'get',
		params:query
	})
}
export function deleteQuestionItems(query){
	return request({
		url:'/biz/trade/guidance/delete/questionItems',
		method:'get',
		params:query
	})
}
export function addQuestion(data){
	return request({
		url:'/biz/trade/guidance/add ',
		method:'post',
		data
	})
}
export function updateQuestion(data){
	return request({
		url:'/biz/trade/guidance/update ',
		method:'post',
		data
	})
}
export function deleteQuestion(query){
	return request({
		url:'/biz/trade/guidance/delete/question',
		method:'get',
		params:query
	})
}
export function listTips(query){
	return request({
		url:'/biz/trade/guidance/tips/list',
		method:'get',
		params:query
	})
}
export function addTip(data){
	return request({
		url:'/biz/trade/guidance/tips/add',
		method:'post',
		data
	})
}
export function updateTip(data){
	return request({
		url:'/biz/trade/guidance/tips/update',
		method:'post',
		data
	})
}
export function deleteTip(query){
	return request({
		url:'/biz/trade/guidance/tips/delete',
		method:'get',
		params:query
	})
}
export function listFeedback(query){
	return request({
		url:'/biz/trade/guidance/record/adminList',
		method:'get',
		params:query
	})
}
export function readTest(query) {
	return request({
		url:'/biz/trade/guidance/record/detail',
		method:'get',
		params:query
	})
}
export function testFeedback(data){
	return request({
		url:'/biz/trade/guidance/feedback',
	    method:'post',
	    data
	})
	
}