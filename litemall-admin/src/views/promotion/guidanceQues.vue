<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-select v-model="listQuery.categoryId" class="filter-item" placeholder="请选择类目" >
				<el-option v-for="(item,index) in quesTypes" :key="item.id" :label="item.name" :value="item.id"/>
			</el-select>
			<el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">查找</el-button>
            <el-button  class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate(0)">添加选择题</el-button>
            <el-button  class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate(1)">添加问答题</el-button>
            <el-button  class="filter-item" type="primary" icon="el-icon-edit" @click="handleTips">导学说明</el-button>
            
		</div>
		<!--查询结果-->
		<div style="height: calc(100% - 155px);overflow: hidden">
			<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                <el-table-column align="center" label="题目ID" prop="id"/>
                <el-table-column align="center" label="类目" prop="categoryName"/>
                
                <el-table-column align="center" label="题型" prop="type">
                	<template slot-scope="scope">
                		<el-tag>{{type[scope.row.type]}}</el-tag>
                	</template>
                </el-table-column>
                
                <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>
        <!--新增/编辑选择题-->
        <el-dialog :title="textMap[dialogStatus]"   :visible.sync="dialogFormVisible" :close-on-click-modal="false" :top="'0'">
			<el-form ref="dataForm"  :model="dataForm" :rules="rules" status-icon label-position="left"
                     label-width="80px" style="width: 400px; margin-left:50px;">
                <el-form-item label="类目" prop="categoryId">
                	<el-select v-model="dataForm.categoryId" placeholder="题目类目">
                		<el-option v-for="(category,index) in quesTypes" :key="category.id" :label="category.name" :value="category.id"/>
                	</el-select>
                </el-form-item>
                <el-form-item label="问题"  prop="content">
                	<el-input type="textarea" :rows="3" v-model="dataForm.content" placeholder="问题"/>
                </el-form-item>
                <el-form-item label="答案" prop="questionItems">
                	 <el-button type="primary" icon="el-icon-plus" circle @click="hanldeAddAnswer"></el-button>
                	 <el-button type="danger" icon="el-icon-minus" circle @click="hanldeMinusAnswer"></el-button>
                	 <ul v-for="(item,index) in dataForm.questionItems">
                	 	<li v-show="count>index">
                	 		<div class="answer-item">
                	 			{{item.identityId}}
                	 			<el-input v-model="item.item" style="width:200px;padding-left:10px;" placeholder="请输入答案"/>
                	 			<el-checkbox class="check-box" :key="item.id"  :checked="item.is" v-model="item.is" @change="handleCheckBox(item.is,index)" style="padding-left:10px;"></el-checkbox>
                	 		</div>
                	 	</li>
                	 </ul>
                </el-form-item >
                <!-- <el-form-item label="答案解析" prop="analysis">
                	<el-input type="textarea" :rows="6" v-model="dataForm.analysis" placeholder="问题"/>
                </el-form-item> -->
                     
            </el-form>
            
            <div slot="footer" class="dialog-footer">

                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="addQuestion">确定</el-button>
                <el-button v-else type="primary" @click="updateQuestion">确定</el-button>
            </div>
		</el-dialog>
		<!--新增/编辑问答题-->
        <el-dialog :title="textMap[dialogStatus]"   :visible.sync="dialogFormVisible1" :close-on-click-modal="false" :top="'0'">
			<el-form ref="dataForm"  :model="dataForm" :rules="rules" status-icon label-position="left"
                     label-width="80px" style="width: 400px; margin-left:50px;">
                <el-form-item label="类别" prop="categoryId">
                	<el-select v-model="dataForm.categoryId" placeholder="题目类别">
                		<el-option v-for="(category,index) in quesTypes" :key="category.id" :label="category.name" :value="category.id"/>
                	</el-select>
                </el-form-item>
                <el-form-item label="问题"  prop="content">
                	<el-input type="textarea" :rows="3" v-model="dataForm.content" placeholder="问题"/>
                </el-form-item>
                
                     
            </el-form>
            
            <div slot="footer" class="dialog-footer">

                <el-button @click="dialogFormVisible1 = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="addQuestion">确定</el-button>
                <el-button v-else type="primary" @click="updateQuestion">确定</el-button>
            </div>
		</el-dialog>
		<!--新增/编辑导学说明-->
        <el-dialog  title="导学说明"   :visible.sync="tipsFormVisible" :close-on-click-modal="false" :top="'0'">
			<el-form  ref="tipForm"  :model="tipForm" :rules="tiprules" status-icon label-position="left"
                     label-width="100px" style="width: 400px; margin-left:40px;">
                <el-form-item label="类别" prop="tipCategory">
                	<el-select v-model="tipForm.tipCategory" placeholder="题目类别"  >
                		<el-option v-for="(category,index) in quesTypes" :key="category.id" :label="category.name" :value="category.id" @click.native="selectTipType"/>
                	</el-select>
                </el-form-item>
                <el-form-item style="width: 700px;" label="问答提示" >
                	<editor :init="editorInit" v-model="tipForm.quesItem.description"/>
                </el-form-item>
                <el-form-item style="width: 700px;" label="图片提示" >
                	<editor :init="editorInit" v-model="tipForm.picItem.description"/>
                </el-form-item>
                <el-form-item style="width: 700px;" label="视频提示" >
                	<editor :init="editorInit" v-model="tipForm.videoItem.description"/>
                </el-form-item>
            </el-form>
            
            <div slot="footer" class="dialog-footer">

                <el-button @click="tipsFormVisible = false">取消</el-button>
                
                <el-button  type="primary" @click="editTips">确定</el-button>
            </div>
		</el-dialog>
	</div>
</template>
<script>
	import Pagination from '@/components/Pagination'
	import {listGuideType,listQues,deleteQuestionItems,addQuestion,updateQuestion,deleteQuestion,listTips,addTip,updateTip,deleteTip} from '@/api/guidance'
	import Editor from '@tinymce/tinymce-vue'
	import {uploadClassIcon} from '@/api/fileUpload'

	export default{
		components:{Pagination,Editor},
		name:'guidanceQues',
		data(){
			return{
				quesTypes:[],
				list:[],
				total:0,
				listLoading:false,
				listQuery:{
					categoryId:undefined,
					page:1,
					limit:20,
					sort:'add_time',
					order:'desc'
				},
				//获得题目类别
				listQuery1:{
					type:1,
					limit:-1
				},
				//获得导学说明
				listQuery2:{
					categoryId:undefined,
					page:1,

				},
				count:0,
				type:['选择题','问答题'],
				dialogFormVisible:false,
				dialogFormVisible1:false,
				tipsFormVisible:false,
			    dialogStatus: '',
			    textMap: {
			    	update: '编辑',
                    create: '创建'
                },
                deleted:{
                	ids:undefined
                },
                
                dataForm:{
                	content:undefined,
                	categoryId:undefined,
                	type:undefined,
                	questionItems:[]
                },
                rules:{
                	categoryId:[{required:true,trigger:'blur',message:'题目类别不能为空'}],
                
                	content: [{required:true,trigger:'blur',message:'问题不能为空'}]
                },
                //导学
                tipItems:[],
                tipForm:{
                	quesItem:{id:undefined,description:'',step:1,categoryId:undefined},
                    picItem:{id:undefined,description:'',step:2,categoryId:undefined},
                    videoItem:{id:undefined,description:'',step:3,categoryId:undefined},
                    tipCategory:undefined,
                },
                
                tiprules:{
                	tipCategory:[{required:true,trigger:'blur',message:'类别不能为空'}],
                
                	
                },
                zh:{
                	quesItem:'问答提示',
                	picItem:'图片提示',
                	videoItem:'视频提示'
                },
                //test:{}
                editorInit: {
                    language: 'zh_CN',
                    convert_urls: false,
                    plugins: [
                        'advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'
                    ],
                    toolbar: [
                        'searchreplace fontselect fontsizeselect bold italic underline strikethrough alignleft aligncenter alignright outdent indent removeformat',
                        'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'
                    ],
                    //  blockquote undo redo removeformat subscript superscript code codesample
                     //imageupload_url: '{:U("File/uploadPicture")}',
                    images_upload_handler: function (blobInfo, success, failure) {
                        const formData = new FormData()
                        formData.append('files', blobInfo.blob())
                        //createStorage(formData)
                        console.log(formData.get("iconFile"))
                        uploadClassIcon(formData).then(res => {
                            console.log(res)
                            success(res.data.data[0])
                        })
                        .catch(() => {
                            failure('上传失败，请重新上传')
                        })
                    },
                   
                },

			}
		},
		created(){
			this.getTypes()
			this.getList()
		},
		// watch:{
  //         'tipForm.tipCategory':function(val,oldVal){
  //           if(!val){
  //             console.log('aaaaaa')
  //             this.selectTipType()
  //           }
  //         },
          
          
  //       },
		methods:{
			getTypes(){
				listGuideType(this.listQuery1).then((res)=>{
					this.quesTypes=res.data.data.items
				})
			},
			getList(){

				this.listLoading=true
				listQues(this.listQuery).then((res)=>{
					if(res.data.errno==0){
						this.list=res.data.data.items

						this.total=res.data.data.total
						this.listLoading=false
						for(var i in this.list){
							for (var j in this.quesTypes){
								if(this.list[i].categoryId==this.quesTypes[j].id){
									this.list[i].categoryName=this.quesTypes[j].name
									break
								}
							}
						}
						
					}else{
						this.list=[]
						this.total=0
						this.listLoading=false
					}
				}).catch((err)=>{
					this.list=[]
					this.total=0
					this.listLoading=false
				})
			},
			handleFilter(){
				this.listQuery.page=1
				this.getList()
			},
			resetForm(){
				this.dataForm={
					content:undefined,
				categoryId:undefined,
				type:undefined,
				questionItems:[]
				}
				
			},
			handleCreate(type){
				if(type==0){
					this.count=0
					this.dialogStatus="create"
					this.dialogFormVisible=true
					this.resetForm()
					this.dataForm.type=0

				}else{
					this.dialogStatus="create"
					this.dialogFormVisible1=true
					this.resetForm()
					this.dataForm.type=1
				}
			},
			hanldeAddAnswer(){
				if(this.count<4){
					this.count++
					if(this.count==1){
						this.dataForm.questionItems.push({identityId:'A',item:'',isTrue:0,is:false})
					}else if(this.count==2){
					    this.dataForm.questionItems.push({identityId:'B',item:'',isTrue:0,is:false})
				    }else if(this.count==3){
					    this.dataForm.questionItems.push({identityId:'C',item:'',isTrue:0,is:false})
				    }else if(this.count==4){
					    this.dataForm.questionItems.push({identityId:'D',item:'',isTrue:0,is:false})
					}
				}else{
					this.$message({
						message:'最多添加四个选项',
						type:'error'
					})
				}
				
				
			},
			hanldeMinusAnswer(){
				if(this.count>2){
					this.count--
					
					if(this.dialogStatus=="update"){
						var deleted={}
						deleted.ids=this.dataForm.questionItems[this.count].id
						if(deleted.ids!=undefined){
							deleteQuestionItems(deleted).then((res)=>{

							})
						}
						
					}
					this.dataForm.questionItems.splice(this.count,1)
				}else{
					this.$message({
						message:'至少添加两个选项',
						type:'error'
					})
				}
			},
			handleCheckBox(val,index){
				//console.log(val)
				if(val==true){
					this.dataForm.questionItems[index].isTrue=1
				}else{
					this.dataForm.questionItems[index].isTrue=0
				}
				
			},
			addQuestion(){
				 this.$refs.dataForm.validate(valid=>{
				 	if(valid){
				 		addQuestion(this.dataForm).then((res)=>{
				 			this.getList()
				 			if(this.dialogFormVisible){
				 				this.dialogFormVisible=false
				 			}
				 			if(this.dialogFormVisible1){
				 				this.dialogFormVisible1=false
				 			}
				 			this.$notify.success({
				 				title: '成功',
                                message: '添加成功'
                            })
				 		}).catch((err)=>{
				 			//this.dialogFormVisible=false
				 			this.$notify.error({
                                title: '失败',
                                message: '添加失败'
                            })
				 		})
				 	}else{
				 		return false
				 	}
				 })
				
			},
			handleUpdate(row){
				if(row.type==0){
					this.dialogStatus = 'update'
                    this.dialogFormVisible = true

                    this.dataForm = Object.assign({}, row)
               
                    this.count=this.dataForm.questionItems.length
                    for(var i in this.dataForm.questionItems){
                    	if(this.dataForm.questionItems[i].isTrue==1){
                		   //this.dataForm.questionItems[i].is=true
                		   this.$set(this.dataForm.questionItems[i],'is',true)
                	    }else if(this.dataForm.questionItems[i].isTrue==0){
                		   //this.dataForm.questionItems[i].is=false
                		   this.$set(this.dataForm.questionItems[i],'is',false)
                	    }  
                    }
				}else{
					this.dialogStatus='update'
					this.dialogFormVisible1=true
					this.dataForm = Object.assign({}, row)
				}
			},
			updateQuestion(){
				this.$refs.dataForm.validate(valide=>{
					if(valide){
						updateQuestion(this.dataForm).then((res)=>{
							this.getList()
					        if(this.dialogFormVisible){
				 				this.dialogFormVisible=false
				 			}
				 			if(this.dialogFormVisible1){
				 				this.dialogFormVisible1=false
				 			}
					        this.$notify.success({
				 				title: '成功',
                                message: '修改成功'
                            })
					    }).catch((err)=>{
					    	//this.dialogFormVisible=false
					    	this.$notify.error({
                                title: '失败',
                                message: '修改失败'
                            })
					    })
					}else{
						return false
					}
				})
				
			},
			handleDelete(row){
				this.$confirm('确定删除该题目吗','提示',{
					confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
				}).then(()=>{
					this.deleted.ids=row.id
					deleteQuestion(this.deleted).then((res)=>{
						this.getList()
						this.$notify.success({
				 			title: '成功',
                            message: '删除成功'
                         })
					}).catch((err)=>{
						this.$notify.error({
                            title: '失败',
                            message: '删除失败'
                        })
					})
				})
				
			},
			handleTips(){
				this.tipsFormVisible=true
				this.tipForm={
					quesItem:{id:undefined,description:'',step:1,categoryId:undefined},
                    picItem:{id:undefined,description:'',step:2,categoryId:undefined},
                    videoItem:{id:undefined,description:'',step:3,categoryId:undefined},
                    tipCategory:undefined,
				}
			},
			selectTipType(){
				this.listQuery2.categoryId=this.tipForm.tipCategory
				listTips(this.listQuery2).then((res)=>{
					//console.log(res)
					this.tipItems=res.data.data
					//console.log(this.tipItems)
					if(res.data.data.length){
						for(var i in res.data.data){
							if(res.data.data[i].step==1){
								this.$set(this.tipForm,'quesItem',res.data.data[i])
								// this.tipForm.quesItem.id=this.tipItems[i].id
								// this.tipForm.quesItem.categoryId=this.tipItems[i].categoryId
								// this.tipForm.quesItem.description=this.tipItems[i].description
							}
							if(res.data.data[i].step==2){
								// this.tipForm.picItem.id=this.tipItems[i].id
								// this.tipForm.picItem.categoryId=this.tipItems[i].categoryId
								// this.tipForm.picItem.description=this.tipItems[i].description
								this.$set(this.tipForm,'picItem',res.data.data[i])
							}
							if(res.data.data[i].step==3){
								this.$set(this.tipForm,'videoItem',res.data.data[i])
							}
						}
					}
				})
			},
			editTips(){
				var zh={
					quesItem:'问答提示',
                	picItem:'图片提示',
                	videoItem:'视频提示'
				}
				for(var key in this.tipForm){
					if(key!='tipCategory'){
						console.log(this.zh[key])
						if(this.tipForm[key].id&&this.tipForm[key].description){
							// for(var i in this.tipItems){
							// 	if(this.tipItems[i].step==this.tipForm[key].step){
							// 		console.log(this.tipItems[i].description)
							// 		console.log(this.tipForm[key].description)
							// 		if(this.tipForm[key].description!=this.tipItems[i].description){
										
							// 		}
							// 		break
							// 	}
							// }
							updateTip(this.tipForm[key]).then((res)=>{
								if(res.data.errno==0){
									this.getList()
									this.tipsFormVisible=false
								}else{
									this.$notify.error({
										title:'失败',
									    message:'修改失败'
									})
								}
							})
							
					    }
					    if(this.tipForm[key].id&&!this.tipForm[key].description){
						    var deleted={ids:undefined}
						    deleted.ids=this.tipForm[key].id
						    deleteTip(deleted).then((res)=>{
							    if(res.data.errno==0){
								   
								    this.getList()
								    this.tipsFormVisible=false
							    }else{
								    this.$notify.error({
									    title:'失败',
									    message:this.zh[key]+'删除失败'
								    })
							    }
						    })
					    }
					    if(!this.tipForm[key].id&&this.tipForm[key].description){
						    //delete this.tipForm[key].id
						    this.tipForm[key].categoryId=this.tipForm.tipCategory
						    console.log(this.tipForm[key])
						    addTip(this.tipForm[key]).then((res)=>{
							    if(res.data.errno==0){
								    
								    this.tipsFormVisible=false
								    this.getList()
							    }else{
								     this.$notify.error({
									    title:'失败',
									    message:this.zh[key]+'添加失败'
								    })
							    }
						    })
					    }
					    
					}
					
				}
				this.$notify.success({
					title:'成功',
					message:'编辑成功'
				})
			}

		}
	}
</script>
<style>
.el-dialog {
        width: 800px;
    }
</style>