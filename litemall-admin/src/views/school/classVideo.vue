<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-button  class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
		</div>
		<!--查询结果-->
		<div style="height: calc(100% - 155px);overflow: hidden">
			<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                <el-table-column align="center" label="视频ID" prop="id"/>
                <el-table-column align="center" label="课程ID" prop="courseId"/>
                <el-table-column align="center" label="课程名称" prop="courseName"/>
                <el-table-column align="center" label="视频名称" prop="name"/>
                <el-table-column align="center" label="是否付费" prop="feeStatus">
                	<template slot-scope="scope">
                		<el-tag>{{feeStatus[scope.row.feeStatus]}}</el-tag>
                		
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
        <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/> -->
         <!--新增/编辑界面-->
        <el-dialog :title="textMap[dialogStatus]"   :visible.sync="dialogFormVisible" :close-on-click-modal="false" :top="'0'" >
			<el-form ref="dataForm"  :model="dataForm"  status-icon label-position="left"
                     label-width="13%" style="width: 95%; margin-left:20px; ">
                <el-form-item label="视频名称" prop="name">
                	<el-input v-model="dataForm.name" style="width:260px;"/>
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
                <el-form-item label="视频">
                   <video v-if="hasvideo" id="myvideo" :src="videoSrc"  :poster="dataForm.coverUrl" :muted="muteStatus" :autoplay="playStatus"  height="250" width="400" controls @click="playVideo">
                    your browser does not support the video tag
                     </video>
                     <!-- <el-button  v-if="dataForm.videoUrl&&!isPlay" size="small" type="primary" @click="playVideo">获取视频</el-button> -->
                    <el-upload  class="upload-demo" action=""
                               :http-request="fnUploadRequest"
                               :show-file-list="true"
                               :limit=1
                               :file-list="fileList1"
                               :on-exceed="beyondFile"
                               :on-success="handleVideoSuccess"
                               :before-upload="beforeUploadVideo">
                        <div tabindex="0" class="el-upload-video">
                            <i class="el-upload-video-i el-icon-plus avatar-uploader-icon"></i>
                        </div>
                        <div v-if="isuploading" slot="tip" class="el-upload__tip">请稍等，文件正在上传中......</div>
                        <!-- <div class="el-upload__tip" slot="tip">上传视频文件，且不超过500mb</div> -->
                    </el-upload>
                    <!-- <el-upload
                        class="upload-uploader"
                        ref="upload5"
                        :headers="headers"
                        :limit="1"
                        :file-list="fileList1"
                        action="111"
                        :http-request="uploadFile5"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload5">
                            上传到服务器
                        </el-button>
                        <el-button  v-if="dataForm.videoUrl&&!isPlay" size="small" type="primary" @click="playVideo">获取视频</el-button>
                         <div slot="tip" class="el-upload__tip">只能上传.mp4文件，且不超过10M</div>
                         <div v-if="isuploading" slot="tip" class="el-upload__tip">请稍等，文件正在上传中......</div>
                    </el-upload> -->
                    
                </el-form-item>
                

                <el-form-item label="是否付费" v-if="classPrice>0">
                	<el-select v-model="dataForm.feeStatus" style="width:260px;">
                		<el-option :key='0' label='否' :value="0"/>
                		<el-option :key='1' label='是' :value="1"/>
                	</el-select>
                </el-form-item>
                <el-form-item label="是否付费" v-else>
                	<span>否</span>
                </el-form-item>
                <el-form-item label="详情" prop="remark">
                	<el-input type="textarea" :rows="4" v-model="dataForm.remark" style="width:260px;"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">

                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="addPayVideo">确定</el-button>
                <el-button v-else type="primary" @click="updatePayVideo">确定</el-button>
            </div>
        </el-dialog>

	</div>
</template>
<script>
     import oss from '@/utils/oss'
	import Pagination from '@/components/Pagination'
	import {listVideos,updatePayVideo,addPayVideo,deletePayVideo,readPayVideo,playVideo} from '@/api/school'
	import {uploadClassIcon,uploadPayVideo} from '@/api/fileUpload'
	import {getToken} from '@/utils/auth'
	
	export default{
		components:{Pagination},
	    name:'classVideo',
	    data(){
	    	return{
	    		
	    		list:[],
	    	    total:0,
	    	    listLoading:false,
	    	    textMap: {
                    update: '编辑',
                    create: '创建'
                },
                fileList:[],
                fileList1:[],
                dialogStatus:'',
                dialogFormVisible:false,
                feeStatus:['否','是'],
                classPrice:undefined,
                dataForm:{
                	courseId:undefined,
                	courseName:undefined,
                	name:undefined,
                	coverUrl:undefined,
                	videoUrl:undefined,
                	feeStatus:undefined,
                	remark:undefined

                },
                deleted:{
                	ids:undefined
                },
                //上传视频
                fileData5: undefined,
                videoSrc:undefined,
                hasvideo:false,
                playStatus:false,
                muteStatus:'',
                isPlay:false,
                isuploading:false
	    	}
	    },
	    created(){
	    	this.dataForm.courseId=this.$route.params.courseId
	    	this.dataForm.courseName=this.$route.params.courseName
	    	this.classPrice=this.$route.params.price
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
	    	/**
       * @description [fnUploadRequest 覆盖默认的上传行为，实现自定义上传]
       * @param    {object}   option [上传选项]
       * @return   {null}   [没有返回]
       */
      async fnUploadRequest(option) {
        oss.ossUploadFile(option)
      },
      // 视频上传
      beforeUploadVideo(file) {
        // todo
        this.isuploading=true
        
      },
      // 视频上传成功后
      handleVideoSuccess(response, file, fileList) {
        // todo
        if(response){
        	this.isuploading=false
        	this.$message({
        		message:'上传成功',
        		type:'success'
        	})
        	this.hasvideo=true
        	this.videoSrc=response.url
            this.dataForm.videoUrl=response.url
            this.fileList1=[]
        }
        
      },
      // 视频添加多个视频文件事件
      beyondFile(files, fileList) {
        // todo
      },

	    	getList(){
	    		this.listLoading=true
	    		var id=this.dataForm.courseId
	    		listVideos(id).then((res)=>{
	    			this.listLoading=false
	    			this.list=res.data.data
	    			//this.classPrice=res.data.data.price
	    			if(this.list.length){
	    				this.total=this.list.length
	    			}
	    			
	    		}).catch((err)=>{
	    			this.list=[]
	    			this.total=0
	    			this.listLoading=false
	    		})
	    	},
	    	resetForm(){
	    		// this.$set(this.dataForm,'name',undefined)
	    		// this.$set(this.dataForm,'coverUrl',undefined)
	    		// this.$set(this.dataForm,'videoUrl',undefined)
	    		// this.$set(this.dataForm,'feeStatus',undefined)
	    		this.dataForm.name=undefined
	    		this.dataForm.coverUrl=undefined
	    		this.dataForm.videoUrl=undefined
	    		this.dataForm.feeStatus=undefined
	    		this.dataForm.remark=undefined
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
            uploadFile5(file) {
                this.fileData5.append('file', file.file);
                //console.log(this.fileData5.get("file"))
            },
//确定上传
            submitUpload5() {
                this.isuploading=true
                this.fileData5 = new FormData();
                this.$refs.upload5.submit();
                var self = this
                uploadPayVideo(this.fileData5).then(function (response) {
                    //console.log(11111)
                    console.log(response)
                    self.$refs.upload5.clearFiles();
                    self.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                    self.dataForm.videoUrl =response.data.data//用于表单提交
                    //self.videoSrc=response.data.data

                    self.hasvideo=true
                    self.videoSrc=response.data.data//用于页面展示
                   
                    console.log(self.videoPic)
                    self.isuploading=false

                    //console.log(self.dataForm.videoUrl)
                })
                .catch(function (error) {
                    self.$message({
                        message: response.data.errmsg,
                        type: 'error'
                    });
                })
            },
	    	handleCreate(){
	    		this.dialogFormVisible=true
	    		this.hasvideo=false
	    		this.dialogStatus='create'
	    		this.resetForm()
	    		this.videoSrc=undefined
	    		this.isPlay=false
	    		this.fileList1=[]
	    		if(!this.classPrice){
	    			this.dataForm.feeStatus=0
	    		}
	    	},
	    	addPayVideo(){
	    		addPayVideo(this.dataForm).then((res)=>{
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
	    	},
	    	handleUpdate(row){
	    		this.dialogStatus = 'update'
                this.dialogFormVisible = true
                this.isPlay=false
                readPayVideo(row.id).then((res)=>{
                	this.playStatus=false
                	this.dataForm=res.data.data
                	this.videoSrc=this.dataForm.videoUrl
                	
                	if(this.dataForm.videoUrl){
                		this.hasvideo=true
                	}
                })
	    	},
	    	updatePayVideo(){
	    		updatePayVideo(this.dataForm).then((res)=>{
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
	    	},
	    	handleDelete(row){
	    		this.deleted.ids=row.id
        	    deletePayVideo(this.deleted).then((res)=>{
					if(res.data.errno==0){
								this.getList()
						        //this.dialogFormVisible=false
						        this.$notify.success({
						        	title: '成功',
                                    message: '删除成功'
                                })					
				    }else if(res.data.errorno==501){
				    	this,$router.push({path:'/login'})
				    }else{
						    	this.$notify.error({
						        	title: '失败',
                                    message: res.data.errmsg
                                })	
				    }
			})
	    	},
	    	playVideo(){
	    		console.log('aa')
	    		if(this.dataForm.videoUrl&&!this.isPlay){
	    			this.playStatus=true
	    			var query={}
	    		this.isPlay=true
	    		var key=this.dataForm.videoUrl.split('/')

	    		// for(var i=1;i<key.length;i++){
	    		// 	query.key+=key[i]
	    		// }
	    		query.key='video/private/'+key[key.length-1]
	    		playVideo(query).then((res)=>{
	    			if(res.data.errno==0){
	    				this.videoSrc=res.data.data
	    			}else if(res.data.errorno==501){
	    				this,$router.push({path:'/login'})
	    			}
	    		})
	    		}
	    		
	    	}

	    }

	}
	

</script>
<style>
.logo{
	 width: 145px;
        height: 145px;
        display: block;
}
.el-upload-video {
        width: 100px;
        height: 100px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .el-upload-video-i{
        font-size: 36px;
        padding-top: 25px;
        color: #8c939d;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }

</style>