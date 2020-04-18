<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-select v-model="listQuery.categoryId" class="filter-item" style="width:200px;" placeholder="请选择题目类别">
				<el-option v-for="(type,index) in categoryList" :key="type.id" :label="type.name" :value="type.id"/>
			</el-select>
			<el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">查找</el-button>
			<el-button  class="filter-item" type="primary"
                       icon="el-icon-edit" @click="handleCreate">添加
            </el-button>
         <!--    <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>	 -->	
		</div>
		<!--查询结果-->
		<div style="height: calc(100% - 155px);overflow: hidden">
			<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                <el-table-column align="center" label="题目ID" prop="id"/>
                <el-table-column align="center" label="问题" prop="question" />
                <el-table-column align="center" label="类别" prop="category"/>
                <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑
                        </el-button>
                        <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>
        <!--新增/编辑界面-->
        <el-dialog :title="textMap[dialogStatus]"   :visible.sync="dialogFormVisible" :close-on-click-modal="false" :top="'0'">
			<el-form ref="dataForm"  :model="dataForm" :rules="rules" status-icon label-position="left"
                     label-width="80px" style="width: 400px; margin-left:50px;">
                <el-form-item label="类别" prop="categoryId">
                	<el-select v-model="dataForm.categoryId" placeholder="题目类别">
                		<el-option v-for="(category,index) in categoryList" :key="category.id" :label="category.name" :value="category.id"/>
                	</el-select>
                </el-form-item>
                <el-form-item label="问题" prop="question">
                	<el-input type="textarea" :rows="3" v-model="dataForm.question" placeholder="问题"/>
                </el-form-item>
                <el-form-item label="答案" prop="questionItems">
                	 <el-button type="primary" icon="el-icon-plus" circle @click="hanldeAddAnswer"></el-button>
                	 <el-button type="danger" icon="el-icon-minus" circle @click="hanldeMinusAnswer"></el-button>
                	 <ul v-for="(item,index) in dataForm.questionItems">
                	 	<li v-show="count>index">
                	 		<div class="answer-item">
                	 			{{item.identityId}}
                	 			<el-input v-model="item.answer" style="width:200px;padding-left:10px;" placeholder="请输入答案"/>
                	 			<el-checkbox class="check-box" :key="item.id"  :checked="item.is" v-model="item.is" @change="handleCheckBox(item.is,index)" style="padding-left:10px;"></el-checkbox>
                	 		</div>
                	 	</li>
                	 </ul>
                </el-form-item >
                <el-form-item label="答案解析" prop="analysis">
                	<el-input type="textarea" :rows="6" v-model="dataForm.analysis" placeholder="问题"/>
                </el-form-item>
                     
            </el-form>
            
            <div slot="footer" class="dialog-footer">

                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="addQuestion">确定</el-button>
                <el-button v-else type="primary" @click="updateQuestion">确定</el-button>
            </div>
		</el-dialog>

	</div>
</template>
<script>
	import Pagination from '@/components/Pagination'
	import {listQuestion,addQuestion,deleteQuestion,deleteQuestionItems,updateQuestion} from '@/api/question'
	import {listSchoolType} from '@/api/school'
	
	export default{
		name:'Question',
		components:{Pagination},
		data(){
			
			return{
				list:undefined,
				total:0,
				listLoading:false,//表格
				downloadLoading:false,//导出
				dialogFormVisible:false,
				dialogStatus: '',
				categoryList:[],
				count:0,//控制选择个数
				
				textMap: {
                    update: '编辑',
                    create: '创建'
                },
                listQuery:{
                	categoryId:undefined,
                	page:1,
                	limit:20,
                	sort:'add_time',
                	order:'desc'
                },
                listCategory:{
                	page:1,
                	limit:50
                },
                dataForm:{
                	question:undefined,
                	categoryId:undefined,
                	questionItems:[],
                	analysis:undefined
                	

                },
                deleted:{
                	ids:undefined
                },
                rules:{
                	categoryId:[{required:true,trigger:'blur',message:'题目类别不能为空'}],
                
                	question: [{required:true,trigger:'blur',message:'问题不能为空'}]
                }

			}

		},
		methods:{
			getList(){
				this.listLoading=true

				listQuestion(this.listQuery).then((res)=>{
					this.listLoading=false
					this.list=res.data.data.items
					this.total=res.data.data.total


				}).catch((err)=>{
					this.total=0
					this.list=[]
					this.listLoading=false
				})
			},
			getCategory(){
				listSchoolType(this.listCategory).then((res)=>{
					this.categoryList=res.data.data.items
				}).catch((err)=>{
					console.log(err)
				})
			},
			handleFilter(){
				this.listQuery.page=1
				this.getList()
			},
			handleCreate(){
				this.dialogFormVisible=true
				this.dialogStatus="create"
				this.count=0
				this.resetForm()
			},
			resetForm(){
				this.dataForm={
					question:undefined,
                	categoryId:undefined,
                	questionItems:[],
                	analysis:undefined
				}
			},
			hanldeAddAnswer(){
				if(this.count<4){
					this.count++
					if(this.count==1){
						this.dataForm.questionItems.push({identityId:'A',answer:'',isTrue:0,is:false})
					}else if(this.count==2){
					    this.dataForm.questionItems.push({identityId:'B',answer:'',isTrue:0,is:false})
				    }else if(this.count==3){
					    this.dataForm.questionItems.push({identityId:'C',answer:'',isTrue:0,is:false})
				    }else if(this.count==4){
					    this.dataForm.questionItems.push({identityId:'D',answer:'',isTrue:0,is:false})
					}
				}else{
					this.$message({
						message:'最多添加四个选项',
						type:'error'
					})
				}
				
				
			},
			hanldeMinusAnswer(){
				if(this.count>0){
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
						message:'选项不能再减少',
						type:'error'
					})
				}
			},
			handleCheckBox(val,index){
				console.log(val)
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
				 			this.dialogFormVisible=false
				 			this.$notify.success({
				 				title: '成功',
                                message: '添加成功'
                            })
				 		}).catch((err)=>{
				 			this.dialogFormVisible=false
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
                //this.dataForm.items=this.dataForm.questionItems
			},
			updateQuestion(){
				this.$refs.dataForm.validate(valide=>{
					if(valide){
						updateQuestion(this.dataForm).then((res)=>{
							this.getList()
					        this.dialogFormVisible=false
					        this.$notify.success({
				 				title: '成功',
                                message: '修改成功'
                            })
					    }).catch((err)=>{
					    	this.dialogFormVisible=false
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
				
			}
		},
		created(){
			this.getList()
			this.getCategory()
		}
	}
</script>
<style>
.answer-item{
	display:flex;
	flex-direction:row;
	display: -webkit-flex; /* Safari */
}
.el-checkbox__inner{
	width:20px;
	height:20px;

}
.el-form-item ul li{
	list-style-type:none;
}
</style>