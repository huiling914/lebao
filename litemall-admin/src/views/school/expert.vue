<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-input v-model="listQuery.name" clearable class="filter-item" style="width:200px" placeholder="请输入专家姓名"/>
			<el-input v-model="listQuery.field" clearable class="filter-item" style="width:200px" placeholder="请输入擅长领域"/>
			<el-button class="filter-item" type="primary" icon="el-icon-search"  @click="handleFilter">查找
            </el-button>
            <el-button  class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加
            </el-button>
            <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
			
		</div>
		<!--查询结果-->
		<div style="height: calc(100% - 155px);overflow: hidden">
			<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                <el-table-column align="center" label="专家ID" prop="id"/>
                <el-table-column align="center" label="专家姓名" prop="name"/>
                <el-table-column align="center" label="性别" prop="gender">
                	<template slot-scope="scope">
                		<el-tag>{{ genderMap[scope.row.gender] }}</el-tag>
                	</template>
                </el-table-column>
                <el-table-column align="center" label="擅长领域" prop="field"/>

                <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button v-permission="['POST /admin/school/update']" type="primary" size="mini"
                                   @click="handleUpdate(scope.row)">编辑
                        </el-button>
                        <el-button v-permission="['POST /admin/school/delete']" type="danger" size="mini"
                                   @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--添加/编辑对话框-->
        <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" :close-on-click-modal="false" :top="'0'">
        	<el-form ref="dataForm"  :rules="rules" :model="dataForm" status-icon label-position="left"
                     label-width="15%" style="width: 95%; margin-left:20px;">
                <el-form-item label="专家姓名" prop="name">
                	<el-input v-model="dataForm.name" clearable class="filter-item" style="width:50%;"/>
                </el-form-item>
                <el-form-item label="专家性别" prop="gender">
                	<el-select style="width:50%;" v-model="dataForm.gender" clearable class="filter-item" placeholder="请选择">
                		<el-option v-for="(value,index) in genderMap" :key="index" :label="value" :value="index"/>
                	</el-select>
                </el-form-item>
                <el-form-item label="专家图片" prop="pictureUrl">
                   <img v-if="dataForm.pictureUrl" :src="dataForm.pictureUrl" class="logo">
                    <el-upload
                        class="upload-uploader"
                        ref="upload1"
                        :headers="headers"
                        :limit="1"
                        :file-list="fileList"
                        action="111"
                        :http-request="uploadFile1"
                        :auto-upload="false"
                        list-type="picture">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload1">
                            上传到服务器
                        </el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="背景图片" prop="backUrl">
                   <img v-if="dataForm.backUrl" :src="dataForm.backUrl" class="logo">
                    <el-upload
                        class="upload-uploader"
                        ref="upload2"
                        :headers="headers"
                        :limit="1"
                        :file-list="fileList"
                        action="111"
                        :http-request="uploadFile2"
                        :auto-upload="false"
                        list-type="picture">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload2">
                            上传到服务器
                        </el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="擅长领域" prop="field">
                	<el-input v-model="dataForm.field" clearable class="filter-item" style="width:50%;"/>
                </el-form-item>
                <el-form-item label="简介" prop="briefIntroduction">
                	<el-input v-model="dataForm.briefIntroduction" clearable class="filter-item" style="width:50%;"/>
                </el-form-item>
                <el-form-item label="详情" prop="description">
                	<editor :init="editorInit" v-model="dataForm.description"/>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer">

                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="addExpert">确定</el-button>
                <el-button v-else type="primary" @click="updateExpert">确定</el-button>
            </div>

        </el-dialog>

	</div>
</template>
<script>
	import Pagination from '@/components/Pagination'
	import {listExpert,addExpert,editExpert,deleteExpert} from '@/api/school'
	import {uploadTeacherIcon} from '@/api/fileUpload'
	import Editor from '@tinymce/tinymce-vue'
	import {getToken} from '@/utils/auth'
    import {handleDownload} from '@/utils/commen'
	export default{
		name:'Expert',
		components:{Pagination,Editor},
		data(){
			return{
				list:undefined,
				total:0,
				listLoading:false,
				downloadLoading:false,
				dialogFormVisible:false,
				dialogStatus: '',
				genderMap:['未知','男','女'],
				textMap: {
                    update: '编辑',
                    create: '创建'
                },
				listQuery:{
					name:undefined,
					field:undefined,
					page:1,
					limit:20,
					sort:'update_time',
					order:'desc'

				},
				rules:{
					name:[
					   {required: true, message: '专家姓名不能为空', trigger: 'blur'}
					],
					gender:[
					   {required: true, message: '专家性别不能为空', trigger: 'blur'}
					],
					field:[
					   {required: true, message: '擅长领域不能为空', trigger: 'blur'}
					],
					briefIntroduction:[
					   {required: true, message: '专家简介不能为空', trigger: 'blur'}
					]

				},
				deleted:{
					ids:undefined
				},
				dataForm:{
					name:undefined,
					gender:undefined,
					field:undefined,
					briefIntroduction:undefined,
					description:'',
					pictureUrl:undefined,
					backUrl:undefined

				},
				fileData1:undefined,
				fileData2:undefined,
				fileList:[],
				//富文本
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
                        uploadTeacherIcon(formData).then(res => {
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
		computed: {
            headers() {
                return {
                    'X-Litemall-Admin-Token': getToken()
                }
            }
        },
		created(){
			this.getList()
		},
		methods:{
			getList(){
				listExpert(this.listQuery).then((res)=>{
					this.listLoading=true
					this.list=res.data.data.items
					this.total=res.data.data.total
					this.listLoading=false
				}).catch((err)=>{
					this.list=[]
					this.total=0
					this.listLoading=false
				})
			},
			handleFilter(){
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
					gender:undefined,
					field:undefined,
					briefIntroduction:undefined,
					description:'',
					pictureUrl:undefined,
					backUrl:undefined
				}
			},
			addExpert(){
				if(!this.dataForm.name){
					this.$message.error('请输入专家姓名！');
				}else if(this.dataForm.gender==undefined){
					this.$message.error('请选择专家性别！');
				}else if(!this.dataForm.field){
					this.$message.error('请输入擅长领域！');
				}else if(!this.dataForm.briefIntroduction){
					this.$message.error('请输入专家简介！');
				}else{
					addExpert(this.dataForm).then((res)=>{
						this.getList()
                        this.dialogFormVisible=false
                        this.$notify.success({
                        	title: '成功',
                            message: '添加成功'
                        })
                    }).catch((err)=>{
                    	this.$notify.error({
                        title: '失败',
                        message: '添加失败'
                        })
                    })
				}
		
				
			},
			handleUpdate(row){
				this.dialogFormVisible=true
				this.dialogStatus="update"
				this.dataForm = Object.assign({}, row)
			},
			updateExpert(){
				if(!this.dataForm.name){
					this.$message.error('请输入专家姓名！');
				}else if(this.dataForm.gender==undefined){
					this.$message.error('请选择专家性别！');
				}else if(!this.dataForm.field){
					this.$message.error('请输入擅长领域！');
				}else if(!this.dataForm.briefIntroduction){
					this.$message.error('请输入专家简介！');
				}else{
					editExpert(this.dataForm).then((res)=>{
						this.getList()
					    this.dialogFormVisible=false
					    this.$notify.success({
					    	title:'成功',
						message:'修改成功',
					})
				}).catch((err)=>{
					this.$notify.error({
                        title: '失败',
                        message: '修改失败'
                        })
				   })
				}
				
			},
			handleDelete(row){
				this.deleted.ids=row.id
				deleteExpert(this.deleted).then((res)=>{
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

			},
			

			//上传专家图片
            uploadFile1(file) {
                this.fileData1.append('files', file.file);
                //console.log(this.fileData.get("iconFile"))
            },
            //确定上传
            submitUpload1() {
                //console.log(111)
                this.fileData1 = new FormData();
                this.$refs.upload1.submit();
                var self = this
                uploadTeacherIcon(this.fileData1).then(function (response) {
                    self.$refs.upload1.clearFiles();
                    self.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                    self.dataForm.pictureUrl = response.data.data[0]//用于展示
                    //self.uploadlogoUrl=response.data.data[0]//用于提交

                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            //上传专家背景图片
            uploadFile2(file) {
                this.fileData2.append('files', file.file);
                //console.log(this.fileData.get("iconFile"))
            },
            //确定上传
            submitUpload2() {
                //console.log(111)
                this.fileData2 = new FormData();
                this.$refs.upload2.submit();
                var self = this
                uploadTeacherIcon(this.fileData2).then(function (response) {
                    self.$refs.upload2.clearFiles();
                    self.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                    self.dataForm.backUrl = response.data.data[0]//用于展示
                    console.log(self.dataForm.backUrl)
                    //self.uploadlogoUrl=response.data.data[0]//用于提交

                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            handleDownload(){
            	this.downloadLoading = true
                const tHeader = [
                        '专家ID',
                        '专家姓名',
                        '专家性别',
                        '擅长领域',
                        '简介'
                        
                    ]
                const filterVal = ['id', 'name', 'gender', 'field', 'briefIntroduction']
                var downQuery=this.listQuery
                downQuery.limit=-1
                handleDownload(tHeader,filterVal,downQuery,'专家信息',listExpert)
                this.downloadLoading=false
            }
		
		}
	}
</script>
<style>
.logo {
        width: 145px;
        height: 145px;
        display: block;
    }
 .el-dialog {
        width: 800px;
    }

</style>