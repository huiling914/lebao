<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-input v-model="listQuery.name" clearable class="filter-item" style="width:200px;" placeholder="请输入考试项目"/>
			<el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">查找</el-button>
			<el-button  class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
            <!-- <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button> -->		
		</div>
		<!--查询结果-->

		<div style="height: calc(100% - 155px);overflow: hidden">
			<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                <el-table-column align="center" label="考试项目ID" prop="id"/>
                <el-table-column align="center" label="考试项目" prop="name" />
                <el-table-column align="center" label="详情" prop="detailInfo">
                    <template slot-scope="scope">
                        <el-dialog :visible.sync="detailDialogVisible" title="详情">
                            <div v-html="detailInfo"/>
                        </el-dialog>
                        <el-button type="primary" size="mini" @click="showDetail(scope.row.id)">预览</el-button>
                    </template>
                </el-table-column>  
                <el-table-column align="center" label="价格" prop="price"/>
                <el-table-column align="center" label="添加时间" prop="addTime"/>
                <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑
                        </el-button>
                        <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="报名详情" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="toRegStu(scope.row)">详情</el-button>                       
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>
         <!--新增/编辑界面-->
        <el-dialog :title="textMap[dialogStatus]"   :visible.sync="dialogFormVisible" :close-on-click-modal="false" :top="'0'">
			<el-form ref="dataForm"  :model="dataForm" :rules="rules" status-icon label-position="left"
                     label-width="100px" style="width: 400px; margin-left:40px;">
                <el-form-item label="考试项目" prop="name">
                	<el-input v-model="dataForm.name" placeholder="请输入考试项目"/>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                	<el-input  v-model="dataForm.price" placeholder="请输入价格"/>
                </el-form-item>
                <el-form-item label="详情" style="width: 700px;" prop="detailInfo">
                	<editor :init="editorInit" v-model="dataForm.detailInfo"/>
                </el-form-item>
                                 
            </el-form>
            
            <div slot="footer" class="dialog-footer">

                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="addExam">确定</el-button>
                <el-button v-else type="primary" @click="updateExam">确定</el-button>
            </div>
		</el-dialog>
	</div>
</template>
<script>
	import Pagination from '@/components/Pagination'
	import {listExam,addExam,updateExam,deleteExam,detailExam} from '@/api/question'
	import Editor from '@tinymce/tinymce-vue'
	import {uploadSchoolIcon} from '@/api/fileUpload'
	export default{
		name:'Examreg',
		components:{Pagination,Editor},
		data(){
			return{
				list:undefined,
				total:0,
				listLoading:false,//表格
				downloadLoading:false,
				
				detailDialogVisible:false,
				detailInfo:'',
				dialogFormVisible:false,
				dialogStatus: '',
				textMap: {
                    update: '编辑',
                    create: '创建'
                },
                listQuery:{
                	name:undefined,
                	page:1,
                	limit:20,
                	sort:"update_time",
                	order:"desc"
                },
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
                        uploadSchoolIcon(formData).then(res => {
                            console.log(res)
                            success(res.data.data[0])
                        })
                        .catch(() => {
                            failure('上传失败，请重新上传')
                        })
                    },
                   
                },
                rules:{
                    name:[
                    	{required:true,trigger:'blur',message:'请填写报名项目'}
                    ],
                    price:[
                    	{required:true,trigger:'blur',message:'请填写价格'},
                    	{pattern:/^[0-9]+.?[0-9]*$/,trigger:'blur',message:'请输入正确价格'}
                    ]

                },
                dataForm:{
                	name:undefined,
                	price:undefined,
                	detailInfo:''
                },
                deleted:{
                	ids:undefined
                }
			}
		},
		watch:{
            'listQuery.name':function(val,oldVal){
                if(!val){
                    this.getList()
                }
            },
            
        },
		methods:{
			getList(){
				this.listLoading=true
				listExam(this.listQuery).then((res)=>{
					this.total=res.data.data.total
					this.list=res.data.data.items
					this.listLoading=false
				}).catch((err)=>{
					this.total=0
					this.list=[]
					this.listLoading=false
				})
			},
			handleFilter(){
				this.listQuery.page=1
				this.getList()
			},
			handleCreate(){
				this.dialogFormVisible=true
				this.dialogStatus="create"
				this.resetForm()
			},
			resetForm(){
				this.dataForm={
					name:undefined,
                	price:undefined,
                	detailInfo:''
				}
			},
			addExam(){
				this.$refs.dataForm.validate(valide=>{
					if(valide){
						addExam(this.dataForm).then((res)=>{
							this.getList()
							this.dialogFormVisible=false
							this.$notify.success({
								title:'成功',
								message:'添加成功'
							})
						}).catch((err)=>{
							this.dialogFormVisible=false
							this.$notify.error({
								title:'失败',
								message:'添加失败'
							})
						})
					}else{
						return false
					}
				})
			},
			showDetail(id){
				this.detailDialogVisible=true
				detailExam(id).then((res)=>{
					this.detailInfo=res.data.data.detailInfo
				}).catch((err)=>{
					this.detailInfo=''
				})
			},
			handleUpdate(row){
				this.dialogFormVisible=true
				this.dialogStatus="update"
				this.dataForm = Object.assign({}, row)
				//this.dataForm.detailInfo=''
				detailExam(row.id).then((res)=>{
					this.$set(this.dataForm,'detailInfo',res.data.data.detailInfo)
				}).catch((err)=>{
					this.$set(this.dataForm,'detailInfo','')
				})
				console.log(this.dataForm)

			},
			updateExam(){
				this.$refs.dataForm.validate(valide=>{
					if(valide){
						updateExam(this.dataForm).then((res)=>{
							this.getList()
							this.dialogFormVisible=false
							this.$notify.success({
								title:'成功',
								message:'修改成功'
							})
						}).catch((err)=>{
							this.dialogFormVisible=false
							this.$notify.error({
								title:'失败',
								message:'修改失败'
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
					deleteExam(this.deleted).then((res)=>{
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
		    toRegStu(row){
		    	this.$router.push({name:'regStudent',params:{examId:row.id}})
		    },
		    handleDownload(){
		    	this.downloadLoading = true
				import('@/vendor/Export2Excel').then(excel => {
					const tHeader = [
					  '考试项目ID',
                      '考试项目',
                      '价格',
                      '添加时间'
                     

                    ]
                    const filterVal = [
                      'id',
                      'name',
                      'price',
                      'addTime',
                      
                    ]
                    excel.export_json_to_excel2(tHeader, this.list, filterVal, '考级报名')
                    this.downloadLoading = false
                  })
		    }
		},
		created(){
			this.getList()
		}
	}
</script>
<style>
.el-form-item__label{
	padding:0;
}
.el-dialog {
        width: 820px;
    }
</style>