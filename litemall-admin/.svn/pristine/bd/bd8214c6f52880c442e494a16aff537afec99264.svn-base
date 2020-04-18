export function handleDownload(tHeader,filterVal,listQuery,tName,listFunction){
	listFunction(listQuery).then((res)=>{
		var list=res.data.data.items
		if(list){
			import('@/vendor/Export2Excel').then(excel => {
					
            excel.export_json_to_excel2(tHeader, list, filterVal, tName)
           
                    
           })
		}else{
			console.log('test')
			this.$notify.error({
                    title:'失败',
                    message:'导出信息为空，请重新选择'
             })
		}
		
	}).catch((err)=>{
		
	})
}
