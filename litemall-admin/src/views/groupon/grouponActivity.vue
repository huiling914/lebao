<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-input v-model="listQuery.orgName" class="filter-item" placeholder="请输入机构名称" style="width:200px;"/>
			<el-select v-model="listQuery.type" class="filter-item" placeholder="请选择折扣类型">
				<el-option v-for="(type,index) in types" :key="index" :label="type" :value="index"/>
			</el-select>
			<el-date-picker v-model="listQuery.startTime" class="filter-item" clearable type="date" value-format="yyyyMMdd" align="right" placeholder="起始日期"/><span class="filter-item">&nbsp;至</span>
            <el-date-picker v-model="listQuery.endTime" class="filter-item" clearable type="date" value-format="yyyyMMdd" align="right" placeholder="结束日期"/>
            <el-button v-permission="['GET /admin/ad/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
            <el-button v-permission="['POST /admin/ad/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
		</div>
		<!--查询结果-->
		<div style="height: calc(100% - 155px);overflow: hidden">
			<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                <el-table-column align="center" label="活动编号" prop="id"/>
                <el-table-column align="center" label="活动名称" prop="name"/>
                
                <el-table-column align="center" label="课程编号" prop="objId"/>
                <el-table-column align="center" label="课程名称" prop="objName"/>
                <el-table-column align="center" label="学校名称" prop="orgName"/>
                <el-table-column align="center" label="折扣类型" prop="orgName" width="150">
                	<template slot-scope="scope">
                		<el-tag>{{types[scope.row.type]}}</el-tag>
                	</template>
                </el-table-column>
                <el-table-column align="center" label="团购有效期(分钟)" prop="expireMinute"/>
                <el-table-column align="center" label="成团人数" prop="requireNum"/>
                <el-table-column align="center" label="单人限购数量" prop="userLimit"/>
                <el-table-column align="center" label="开始时间" prop="startTime"/>
                <el-table-column align="center" label="结束时间" prop="endTime"/>
                 <el-table-column align="center" label="拼团详情" width="120" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="toGroupList(scope.row)">查看</el-button>
                       
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
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left"
                     label-width="100px" style="width: 400px; margin-left:40px;">
                <el-form-item label="活动名称" prop="name">
                	<el-input v-model="dataForm.name" clearable/>
                </el-form-item>
                <el-form-item label="活动LOGO" prop="logoUrl">
                    <img v-if="dataForm.logoUrl" :src="dataForm.logoUrl" class="logo">
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
                <el-form-item label="商品类别" prop="objType">
                	<el-select v-model="dataForm.objType" clearable @change="selectObjType">
                		<el-option v-for="(type,index) in objType" :key="type.id" :label="type.value" :value="type.id"/>
                	</el-select>
                </el-form-item>
                <el-form-item label="机构名称" prop="orgId">
                	<el-select v-model="dataForm.orgId" clearable filterable @change="getLabel1">
                		<el-option v-for="(school,index) in orgList" :key="school.id" :label="school.name" :value="school.id"/>
                	</el-select>
                </el-form-item>
                <el-form-item label="商品名称" prop="objId">
                	<el-select v-model="dataForm.objId" clearable filterable @change="getLabel2">
                		<el-option v-for="(course,index) in objList" :key="course.id" :label="course.name" :value="course.id"/>
                	</el-select>
                </el-form-item>
                
                <el-form-item label="折扣类型" prop="type">
                	<el-select v-model="dataForm.type" clearable>
                		<el-option v-for="(type,index) in types" :key="index" :label="type" :value="index"/>
                	</el-select>
                </el-form-item>
                <el-form-item label="原价" prop="originalPrice">
                	<el-input v-model="dataForm.originalPrice" clearable/>
                </el-form-item>
                <el-form-item label="折扣价" prop="discountPrice">
                	<el-input v-model="dataForm.discountPrice" clearable/>
                </el-form-item>
                <el-form-item label="团长折扣价" prop="founderPrice">
                	<el-input v-model="dataForm.founderPrice" clearable/>
                </el-form-item>
                <el-form-item label="库存数量" prop="stockNum">
                	<el-input v-model="dataForm.stockNum" clearable/>
                </el-form-item>
                <el-form-item label="已售数量" prop="soldNum">
                	<el-input v-model="dataForm.soldNum" clearable/>
                </el-form-item>
                <el-form-item style="width: 700px;" label="详情" prop="description">
                	<editor :init="editorInit" v-model="dataForm.description"/>
                </el-form-item>
                <el-form-item label="开始时间" prop="startTime">
                	<el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" v-model="dataForm.startTime" clearable/>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime">
                	<el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" v-model="dataForm.endTime" clearable/>
                </el-form-item>
                <el-form-item label="单人限购数" prop="userLimit">
                	<el-input v-model="dataForm.userLimit" clearable/>
                </el-form-item>
                <el-form-item label="成团人数" prop="requireNum">
                	<el-input v-model="dataForm.requireNum" clearable/>
                </el-form-item>
                <el-form-item label="团购有效期(分钟)" prop="expireMinute">
                	<el-input v-model="dataForm.expireMinute" clearable/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">

                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button :loading="addLoading" v-if="dialogStatus=='create'" type="primary" @click="addActivity">确定</el-button>
                <el-button :loading="addLoading" v-else type="primary" @click="updateActivity">确定</el-button>
            </div>
        </el-dialog>
	</div>
</template>
<script>
	import Pagination from '@/components/Pagination'
	import {listActivity,addActivity,readActivity,updateActivity,deleteActivity} from '@/api/groupon'
	import Editor from '@tinymce/tinymce-vue'
	
	import {listSchool,listClass,listPayClass} from '@/api/school'
	import {listBrand} from '@/api/brand'
	import {listGoods} from '@/api/goods'
	import {getToken} from '@/utils/auth'
	import {uploadAdIcon} from '@/api/fileUpload'
	export default{
		components:{Pagination,Editor},
		name:'grouponActivity',
		data(){
			return{
				list:[],
				total:0,
				listLoading:false,
				listQuery:{
					limit:10,
					page:1,
					orgName:undefined,
					objName:undefined,
					type:undefined,
					startTime:undefined,
					endTime:undefined,
					sort:'update_time',
					order:'desc'
				},
				listOrgQuery:{
					page:1,
					limit:-1
				},
				listObjQuery:{
					page:1,
					limit:-1,
					brandId:undefined,
					schoolId:undefined,
				},
				types:['普通拼团折扣','团长减免'],
				objType:[{id:1,value:'线下课程'}],
				orgList:[],
				objList:[],
				fileList:[],
				fileData1:[],
				dataForm:{
					name:undefined,
					logoUrl:undefined,
					orgId:undefined,
					orgName:undefined,
					objId:undefined,
					objName:undefined,
					objType:undefined,
					type:undefined,
					originalPrice:undefined,
					discountPrice:undefined,
					founderPrice:undefined,
					stockNum:undefined,
					soldNum:undefined,
					description:'',
					startTime:undefined,
					endTime:undefined,
					userLimit:undefined,
					requireNum:undefined,
					expireMinute:undefined,

				},
				dialogFormVisible:false,
				
			    dialogStatus: '',
			    textMap: {
			    	update: '编辑',
                    create: '创建'
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
                        uploadAdIcon(formData).then(res => {
                            console.log(res)
                            success(res.data.data[0])
                        })
                        .catch(() => {
                            failure('上传失败，请重新上传')
                        })
                    }
                },
                deleted:{
                	ids:undefined,
                },
                addLoading:false,
                rules:{
                	logoUrl:[  
                	  {required:true,message:'活动类别LOGO不能为空',trigger:'blur'}
                	],
                	objType:[
                	  {required:true,message:'活动类别不能为空',trigger:'blur'}
                	],
                	objId:[
                	  {required:true,message:'商品名称不能为空',trigger:'blur'}
                	],
                	type:[
                	  {required:true,message:'折扣类型不能为空',trigger:'blur'}
                	],
                	originalPrice:[
                	  {required: true, message: '原价不能为空', trigger: 'blur'},
                      {pattern:/^[0-9]+.?[0-9]*$/, message: '请输入正确原价', trigger: 'blur'}
                	],
                	discountPrice:[
                	  {required: true, message: '折扣价不能为空', trigger: 'blur'},
                      {pattern:/^[0-9]+.?[0-9]*$/, message: '请输入正确折扣价', trigger: 'blur'}
                	],
                	startTime:[
                	  {required:true,message:'开始时间不能为空',trigger:'blur'}
                	],
                	endTime:[
                	  {required:true,message:'结束时间不能为空',trigger:'blur'}
                	],
                	userLimit:[
                	  {required:true,message:'单人限购不能为空',trigger:'blur'},
                	  {pattern:/^[1-9]\d*$/,message: '请输入正确单人限购数', trigger: 'blur'}
                	],
                	requireNum:[
                	  {required:true,message:'成团人数不能为空',trigger:'blur'},
                	  {pattern:/^[0-9]*[1-9][0-9]*$/, message: '请输入正确成团人数', trigger: 'blur'}
                	],
                	expireMinute:[
                	  {required:true,message:'活动有效时间不能为空',trigger:'blur'},
                	  {pattern:/^[0-9]*[1-9][0-9]*$/, message: '请输入正确有效时间', trigger: 'blur'}
                	],

                }
			}
		},
		created(){
			this.getList()
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
				listActivity(this.listQuery).then((res)=>{
					if(res.data.errno==0){
						this.list=res.data.data.items
					    this.total=res.data.data.total
					    this.listLoading=false
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
				this.getList()
			},
			resetForm(){
				this.dataForm={
					name:undefined,
					logoUrl:undefined,
					orgId:undefined,
					orgName:undefined,
					objId:undefined,
					objName:undefined,
					objType:undefined,
					type:undefined,
					originalPrice:undefined,
					discountPrice:undefined,
					founderPrice:undefined,
					stockNum:undefined,
					soldNum:undefined,
					description:'',
					startTime:undefined,
					endTime:undefined,
					userLimit:undefined,
					requireNum:undefined,
					expireMinute:undefined,
				}
			},

			getLabel1(val){
				//console.log(val)
				var obj={}
				obj=this.orgList.find(item=>{
						return item.id==val
					})
			    this.dataForm.orgName=obj.name
			    //console.log(this.dataForm.orgName)
				this.getObjList()
				this.objId=undefined
			},
			getLabel2(val){
				var obj={}
				obj=this.objList.find(item=>{
						return item.id==val
					})
			    this.dataForm.objName=obj.name
			},
			
			selectObjType(){
				this.getOrgList()
				if(this.dataForm.objType==0){
					this.getObjList()
				}
				this.dataForm.orgId=undefined
				this.dataForm.objId=undefined
			},
			
			getOrgList(){
				if(this.dataForm.objType==0||this.dataForm.objType==1){
					listSchool(this.listOrgQuery).then((res)=>{
						this.orgList=res.data.data.items
					})
				}else if(this.dataForm.objType==2){
					listBrand(this.listOrgQuery).then((res)=>{
						this.orgList=res.data.data.items
					})
				}
			},
			getObjList(){
				if(this.dataForm.objType==0){
					this.listObjQuery.schoolId=0
					listPayClass(this.listObjQuery).then((res)=>{
						this.objList=res.data.data.items
					})
				}else if(this.dataForm.objType==1){
					this.listObjQuery.schoolId=this.dataForm.orgId
					listClass(this.listObjQuery).then((res)=>{
						this.objList=res.data.data.items
					})
				}else if(this.dataForm.objType==2){
					this.listObjQuery.brandId=this.dataForm.orgId
					listGoods(this.listObjQuery).then((res)=>{
						this.objList=res.data.data.items
					})
				}
			},
			handleUpdate(row){
				this.dialogStatus = 'update'
                this.dialogFormVisible = true
                readActivity(row.id).then((res)=>{
                	this.dataForm=res.data.data
                	this.getOrgList()
                    this.getObjList()
                    if(this.dataForm.orgId==0){
                	    this.dataForm.orgId=undefined
                    }

                })
                

                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
			},
			updateActivity(){
				this.$refs.dataForm.validate(valid=>{
					if(valid){
						this.addLoading=true
						updateActivity(this.dataForm).then((res)=>{
							if(res.data.errno==0){
								this.getList()
								this.dialogFormVisible=false
								this.addLoading=false
								this.$notify.success({
									title:'成功',
									message:'修改成功'
								})
							}else{
								this.addLoading=false
								this.$notify.error({
									title:'失败',
									message:res.data.errmsg
								})
							}
						}).catch((err)=>{
							this.addLoading=false
							this.$notify.error({
								title:'失败',
								message:err.data.errmsg
							})
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
                uploadAdIcon(this.fileData1).then(function (response) {
                    self.$refs.upload1.clearFiles();
                    self.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                    //self.dataForm.logoUrl=uploadHeaderPath+response.data.data[0]
                    self.dataForm.logoUrl = response.data.data[0]
                    

                    
                    //console.log(response.data.data[0])
                    //self.uploadlogoUrl=response.data.data[0]
                    //console.log(self.dataForm.logoUrl)
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
			handleCreate(){
				this.dialogStatus="create"
				this.dialogFormVisible=true
				this.orgList=[]
				this.objList=[]
				this.resetForm()
				this.addLoading=false
				this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })

			},
			addActivity(){
				
				this.$refs.dataForm.validate(valid=>{
					if(valid){
						this.addLoading=true
						addActivity(this.dataForm).then((res)=>{
							console.log(res)
							if(res.data.errno==0){
								this.getList()
								this.dialogFormVisible=false
								this.addLoading=false
								this.$notify.success({
									title:'成功',
									message:'添加成功'
								})
							}else{
								//console.log('test')
								this.addLoading=false
								this.$notify.error({
									title:'失败',
									message:res.data.errmsg
								})
							}
						}).catch((err)=>{
							this.addLoading=false
							this.$notify.error({
								title:'失败',
								message:err.data.errmsg
							})
						})
					}else{
						return false
					}
				})

			},
			handleDelete(row){
				this.$confirm('确定删除该活动吗','提示',{
					confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
				}).then(()=>{
					this.deleted.ids=row.id
					deleteActivity(this.deleted).then((res)=>{
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
			toGroupList(row){
				this.$router.push({name:'grouponList',params:{actId:row.id}})
			}
			
		}
	}
</script>
<style>
.el-dialog {
        width: 800px;
    }
  .logo{
	 width: 145px;
        height: 145px;
        display: block;
}  
</style>