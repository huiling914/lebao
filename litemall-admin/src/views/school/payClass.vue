<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-input v-model="listQuery.name" clearable style="width:160px;" class="filter-item" placeholder="请输入课程名称"/>
            <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">查找</el-button>
            <el-button  class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
		</div>
		<!--查询结果-->
		<div style="height: calc(100% - 155px);overflow: hidden">
			<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                <el-table-column align="center" label="学校名称" prop="orgName"/>
                <el-table-column align="center" label="课程ID" prop="id"/>
                <el-table-column align="center" label="课程名称" prop="name"/>
                <el-table-column align="center" label="课程子名称" prop="subName"/>
                <el-table-column align="center" label="课程价格" prop="price"/>
                <el-table-column align="center" label="课程类别" prop="typeName"/>
                <el-table-column align="center" label="课程级别" prop="level"/>
                <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑
                        </el-button>
                        <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="视频操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="toVideos(scope.row)">详情</el-button>                       
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>
         <!--新增/编辑界面-->
        <el-dialog :title="textMap[dialogStatus]"   :visible.sync="dialogFormVisible" :close-on-click-modal="false" :top="'0'" >
			<el-form ref="dataForm"  :model="dataForm" :rules="rules" status-icon label-position="left"
                     label-width="10%" style="width: 95%; margin-left:20px; ">
                <el-form-item label="学校ID" prop="orgId">
                	<el-input v-model="dataForm.orgId" style="width:260px;"/>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                	<el-input v-model="dataForm.name" style="width:260px;"/>
                </el-form-item>
                <el-form-item label="子名称" prop="subName">
                	<el-input v-model="dataForm.subName" style="width:260px;"/>
                </el-form-item>
                <el-form-item label="封面" prop="coverUrl">
                    <img v-if="dataForm.coverUrl" :src="dataForm.coverUrl" class="logo">
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
                <el-form-item label="价格" prop="price">
                	<el-input v-model="dataForm.price" style="width:260px;"/>
                </el-form-item>
                <el-form-item label="级别" prop="level">
                	<el-input v-model="dataForm.level" style="width:260px;"/>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                	<el-select v-model="dataForm.type" style="width:260px;">
                		<el-option v-for="(item,index) in classTypes" :key="item.id" :label="item.name" :value="item.id"/>
                	</el-select>
                </el-form-item>
                <el-form-item label="详情" prop="detailInfo">
                	<editor :init="editorInit" v-model="dataForm.detailInfo"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">

                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="addPayClass">确定</el-button>
                <el-button v-else type="primary" @click="updatePayClass">确定</el-button>
            </div>
        </el-dialog>

                

	</div>
</template>
<script>
import Pagination from '@/components/Pagination'
import {listPayClass,listClassType,addPayClass,updatePayClass,readPayClass,deletePayClass,listVideos} from '@/api/school'
import {uploadClassIcon} from '@/api/fileUpload'
import Editor from '@tinymce/tinymce-vue'
import {getToken} from '@/utils/auth'
export default{
	name:'payClass',
	components:{Pagination,Editor},
	data(){
		return{
			listQuery:{
				name:undefined,
				page:1,
				limit:20,
				sort:'update_time',
				order:'desc'
			},
			listQuery1:{
				type:2,
				limit:-1
			},
			list:[],
			listLoading:false,
			total:0,
			classTypes:[],
			dialogFormVisible:false,
			dialogStatus: '',
			textMap: {
                update: '编辑',
                create: '创建'
            },
            fileList:[],
            dataForm:{
            	orgId:undefined,
            	name:undefined,
            	subName:undefined,
            	coverUrl:undefined,
            	type:undefined,
            	level:undefined,
            	price:undefined,
            	detailInfo:''
            },
            deleted:{
            	ids:undefined
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
                        uploadClassIcon(formData).then(res => {
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
                    type:[
                    	{required:true,trigger:'blur',message:'请填写报名项目'}
                    ],
                    coverUrl:[
                    	{required:true,trigger:'blur',message:'请上传封面图'}
                    ],
                    price:[
                    	{required:true,trigger:'blur',message:'请填写价格'},
                    	{pattern:/^[0-9]+.?[0-9]*$/,trigger:'blur',message:'请输入正确价格'}
                    ]

                },
		}
	},
	created(){
		this.getClassType()
		this.getList()
        //this.getList1()
		//this.getClassType()
	},
    computed: {
            headers() {
                return {
                    'X-Litemall-Admin-Token': getToken()
                }
            }
        },
	methods:{
		getList(){
			this.listLoading=true
			listPayClass(this.listQuery).then((res)=>{
				this.listLoading=false
				this.list=res.data.data.items
				this.total=res.data.data.total
				
				for(var i in this.list){
					for(var j in this.classTypes){
						if(this.list[i].type==this.classTypes[j].id){
							this.list[i].typeName=this.classTypes[j].name
							break
						}
					}
				}
			}).catch((err)=>{
				this.listLoading=false
				this.list=[]
				this.total=0
			})
		},
		getClassType(){
			listClassType(this.listQuery1).then((res)=>{
				this.classTypes=res.data.data.items
			})
		},
		handleFilter(){
			this.listQuery.page=1
			this.getList()
		},
		handleCreate(){
			this.dialogFormVisible=true
			this.dialogStatus='create',
			this.resetForm()
			this.fileList=[]
		},
		resetForm(){
			this.dataForm={
				orgId:undefined,
            	name:undefined,
            	subName:undefined,
            	coverUrl:undefined,
            	type:undefined,
            	level:undefined,
            	price:undefined,
            	detailInfo:''
			}
		},
		addPayClass(){
			this.$refs.dataForm.validate(valid=>{
				if(valid){
					addPayClass(this.dataForm).then((res)=>{
						if(res.data.errno==0){
							this.getList()
							this.dialogFormVisible=false
							this.$notify.success({
								title:'成功',
								message:'添加成功'
							})
						}else{
							this.$notify.error({
								title:'失败',
								message:res.data.errmsg
							})
						}
					})
				}else{
					return false
				}
			})
		},
		uploadFile1(file) {
                this.fileData1.append('files', file.file);
                //console.log(this.fileData1.get("iconFile"))
            },
            submitUpload1() {
                this.fileData1 = new FormData();
                this.$refs.upload1.submit();
                var self = this
                uploadClassIcon(this.fileData1).then(function (response) {
                    self.$refs.upload1.clearFiles();
                    self.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                    //self.dataForm.logoUrl=uploadHeaderPath+response.data.data[0]
                    self.dataForm.coverUrl = response.data.data[0]
                    self.picFlag=1

                    
                    //console.log(response.data.data[0])
                    //self.uploadlogoUrl=response.data.data[0]
                    //console.log(self.dataForm.logoUrl)
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
        handleUpdate(row){
        	this.fileList=[]
        	this.dialogStatus = 'update'
            this.dialogFormVisible = true

            this.dataForm = Object.assign({}, row)
            readPayClass(row.id).then((res)=>{
            	this.dataForm.detailInfo=res.data.data.detailInfo
            })
        },
        updatePayClass(){
        	this.$refs.dataForm.validate(valid=>{
				if(valid){
					updatePayClass(this.dataForm).then((res)=>{
						if(res.data.errno==0){
							this.getList()
							this.dialogFormVisible=false
							this.$notify.success({
								title:'成功',
								message:'修改成功'
							})
						}else{
							this.$notify.error({
								title:'失败',
								message:res.data.errmsg
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
        	deletePayClass(this.deleted).then((res)=>{
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
        },
        toVideos(row){
        	this.$router.push({name: 'classVideo', params: {courseId:row.id,courseName:row.name,price:row.price}})
        },
        getList1(){
                //this.listLoading=true
                var id=1
                listVideos(id).then((res)=>{
                    //this.listLoading=false
                    // this.list=res.data.data.items
                    // if(this.list.length){
                    //     this.total=this.list.length
                    // }
                    
                }).catch((err)=>{
                    this.list=[]
                    this.total=0
                    this.listLoading=false
                })
            },
	}
}
</script>
<style>
.logo{
	 width: 145px;
        height: 145px;
        display: block;
}
.el-dialog__body{
	font-size:10px;
	padding:10px 10px;
}
.el-form-item__label {
	padding:0 6px 0 0;
}
</style>