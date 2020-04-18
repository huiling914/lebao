<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-select v-model="listQuery.enabled" class="filter-item" placeholder="是否启用" clearable>
				<el-option :key="1" label="是" :value="1"/>
				<el-option :key="0" label="否" :value="0"/>
			</el-select>
			<el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">查找</el-button>
			<el-button  class="filter-item" type="primary"
                       icon="el-icon-edit" @click="handleCreate">添加
            </el-button>
		</div>
		<!--查询结果-->
		<div style="height: calc(100% - 155px);overflow: hidden">
			<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                <el-table-column align="center" label="规则ID" prop="id"/>
                <el-table-column align="center" label="规则名称" prop="name"/>
                <el-table-column align="center" label="是否启用" prop="enabled">
                	<template slot-scope="scope">
                		<el-tag>{{isEnable[scope.row.enabled]}}</el-tag>
                	</template>
                </el-table-column>
                <el-table-column align="center" label="添加时间" prop="addTime"/>
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
        	<el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left"
                      label-width="100px" style="width: 400px; margin-left:40px;">
                <el-form-item label="规则名称" prop="name">
                    <el-input v-model="dataForm.name" style="width:240px;"/>
                </el-form-item>
                
                
                <el-form-item  style="width: 700px;" label="规则内容" prop="description">
                    <editor :init="editorInit" v-model="dataForm.description"/>
                </el-form-item>
                
                <el-form-item label="是否展示" prop="enabled" >
                    <el-select v-model="dataForm.enabled" style="width:240px;">
                    	<el-option :key="1" label="是" :value="1"/>
				        <el-option :key="0" label="否" :value="0"/>
				    </el-select>

                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="addRules">确定</el-button>
                <el-button v-else type="primary" @click="updateRules">确定</el-button>
            </div>
        </el-dialog>
	</div>
</template>
<script>
    import Pagination from '@/components/Pagination'
    import {listRules,addRules,updateRules,deleteRules} from '@/api/question'
    import {uploadTopicIcon} from '@/api/fileUpload'
    import Editor from '@tinymce/tinymce-vue'
	export default{
		name:'quesRuels',
		components:{Pagination, Editor},
		data(){
			return{
				list:[],
				listLoading:false,
				total:0,
				listQuery:{
					page:1,
					limit:20,
					sort:'add_time',
					order:'desc'
				},
				isEnable:{
					true:'是',
					false:'否'
				},
				textMap: {
                    update: '编辑',
                    create: '创建'
                },
                dialogStatus:'',
                dialogFormVisible:false,
                dataForm:{
                	name:undefined,
                	description:'',
                	enabled:undefined
                },
                deleted:{
                	ids:undefined
                },
                rules:{
                	name:[{required:true,trigger:'blur',message:'规则名称不能为空'}],
                
                	description: [{required:true,trigger:'blur',message:'内容不能为空'}],
                	enabled:[{required:true,trigger:'blur',message:'是否启用不能为空'}],
                },
                editorInit: {
                    language: 'zh_CN',
                    convert_urls: false,
                    height:300,
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
                        //console.log(formData.get("iconFile"))
                        uploadTopicIcon(formData).then(res => {
                            console.log(res)
                            success(res.data.data[0])
                        })
                        .catch(() => {
                            failure('上传失败，请重新上传')
                        })
                    }
                }

			}
		},
		created(){
			this.getList()
		},
		methods:{
			getList(){
				this.listLoading=true
				listRules(this.listQuery).then((res)=>{
					this.list=res.data.data.items
					this.total=res.data.data.total
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
			resetForm(){
				this.dataForm={
					name:undefined,
					description:'',
					enabled:undefined
				}
			},
			handleCreate(){
				this.dialogFormVisible=true
				this.dialogStatus='create'
				this.resetForm()
			},
			addRules(){
				this.$refs.dataForm.validate(valid=>{
					if(valid){
						addRules(this.dataForm).then((res)=>{
							if(res.data.errno==0){
								this.getList()
						        this.dialogFormVisible=false
						        this.$notify.success({
						        	title: '成功',
                                    message: '添加成功'
                                })					
						    }else{
						    	this.$notify.error({
						        	title: '失败',
                                    message: res.data.errmsg
                                })	
						    }
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
                if(this.dataForm.enabled==false){
                	this.dataForm.enabled=0
                }else{
                	this.dataForm.enabled=1
                }
			},
			updateRules(){
				this.$refs.dataForm.validate(valid=>{
					if(valid){
						updateRules(this.dataForm).then((res)=>{
							if(res.data.errno==0){
								this.getList()
						        this.dialogFormVisible=false
						        this.$notify.success({
						        	title: '成功',
                                    message: '修改成功'
                                })					
						    }else{
						    	this.$notify.error({
						        	title: '失败',
                                    message: res.data.errmsg
                                })	
						    }
						})
					}else{
						return false
					}
				})
			},
			handleDelete(row){
				this.deleted.ids=row.id
				deleteRules(this.deleted).then((res)=>{
					if(res.data.errno==0){
								this.getList()
						        //this.dialogFormVisible=false
						        this.$notify.success({
						        	title: '成功',
                                    message: '删除成功'
                                })					
						    }else{
						    	this.$notify.error({
						        	title: '失败',
                                    message: res.data.errmsg
                                })	
						    }
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