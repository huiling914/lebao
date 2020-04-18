export function isNull(rule,value,callback){
	if(value==undefined){
		return callback(new Error('不可以为空'))
	}else{
		callback()
	}
}
