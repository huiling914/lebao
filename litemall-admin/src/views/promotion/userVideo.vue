<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-select v-model="listQuery.audit_result" class="filter-item" style="width:200px" placeholder="请选择审核状态" clearable>
				<el-option v-for="(value,index) in audit" :key="index" :label="value" :value="index"/>
			</el-select>
			<el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">查找</el-button>
			<!-- <el-button  class="filter-item" type="primary" :loading="downloadLoading"
                       icon="el-icon-edit" @click="handleDownLoad">导出
            </el-button> -->
		</div>
		<!--查询结果-->


		<div style="height: calc(100% - 155px);overflow: hidden">
            <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row height="100%">
            	<el-table-column align="center" label="用户ID" prop="userId"/>
            	<el-table-column align="center" label="审核状态" prop="status">
            		<template slot-scope="scope">
            			<el-tag>{{audit[scope.row.status]}}</el-tag>
            		</template>
            	</el-table-column>
            	<el-table-column align="center" label="视频详情" prop="description"/>
            	<el-table-column align="center" label="申请发布时间" prop="addTime"/>
            	<el-table-column align="center" label="专家评论" class-name="small-padding fixed-width">
            		<template slot-scope="scope">
            			<el-button v-if="scope.row.status==1" type="primary" size="mini" @click="handleExpert(scope.row)">详情</el-button>
            		</template>
            	</el-table-column>
            	<el-table-column align="center" label="操作"  class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <!-- <el-button type="primary" size="mini" @click="">详情</el-button> -->
                        <el-button type="success" size="mini" @click="handleAudit(scope.row)">审核</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="评论审核"  class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status==1" type="primary" size="mini" @click="handleComment(scope.row)">审核</el-button>
                        
                    </template>
                </el-table-column>
                
            </el-table>
        </div>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>
        <!--审核对话框-->
        <el-dialog title="审核" :close-on-click-modal="false" :visible.sync="dialogFormVisible" >
         <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left"  label-width="18%" style="width: 90%; margin-left:50px;">
        	<el-form-item label="用户ID" prop="userId">
                    <span>{{dataForm.userId}}</span>
            </el-form-item>
            <el-form-item label="视频描述" prop="description">
            	<span>{{dataForm.description}}</span>
            </el-form-item>
            <el-form-item label="视频" prop="url">
            	<video  id="myvideo" :src="dataForm.url"   :muted="muteStatus" :autoplay="playStatus"  height="250" width="400" controls>
                    your browser does not support the video tag
                </video>
            </el-form-item>
            <el-form-item label="审核状态" prop="status"> 
            	<span><el-tag>{{audit[dataForm.status]}}</el-tag></span>
            </el-form-item>
            <el-form-item label="申请发布时间" prop="addTime">
            	<span>{{dataForm.addTime}}</span>
            </el-form-item>
            <el-form-item v-if="dataForm.status!=0" label="审核人员" prop="auditAdminId">
            	<span>{{dataForm.auditAdminId}}</span>
            </el-form-item>
            <el-form-item  v-if="dataForm.status==0" label="是否通过" prop="result">
            	<el-select v-model="dataForm.result" placeholder="是否通过">
            		<el-option label="通过" value="0"/>
            		<el-option label="拒绝" value="1"/>
            	</el-select>
            </el-form-item>
            <el-form-item v-if="dataForm.status!=0" label="审核意见" prop="auditFeedback">
            	<span>{{dataForm.auditFeedback}}</span>
            </el-form-item>
            <el-form-item v-else="dataForm.status==0" label="审核意见" prop="auditFeedback">
            	<el-input type="textarea" :row="3" v-model="dataForm.auditFeedback" placeholder="请输入审核意见"/>
            </el-form-item>
            
         </el-form>
         <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button :loading="auditLoading" v-if="dataForm.status==0" type="primary" @click="auditVideo">审核</el-button>
                <el-button v-else type="primary" @click="dialogFormVisible = false">确定</el-button>
          </div>

        </el-dialog >
        <!--评论审核-->
        <el-dialog title="评论审核" :close-on-click-modal="false" :visible.sync="commentFormVisible" >
        	<el-table v-loading="commentLoading" :data="comments" element-loading-text="正在查询中。。。" border fit highlight-current-row height="100%">
        		<el-table-column align="center" label="评论ID" prop="id"/>
        		<el-table-column align="center" label="用户ID" prop="userId"/>
        		<el-table-column align="center" label="视频ID" prop="userVideoId"/>
        		
        		<el-table-column align="center" label="评论" prop="comment"/>
        		<el-table-column align="center" label="评论时间" prop="addTime"/>
        		<el-table-column align="center" label="类型" prop="type">
        			<template slot-scope="scope">
        				<el-tag>{{commentType[scope.row.type]}}</el-tag>
        			</template>
        		</el-table-column>
        		<el-table-column align="center" label="状态" prop="status">
        			<template slot-scope="scope">
        				<el-tag>{{commentStatus[scope.row.status]}}</el-tag>
        			</template>
        		</el-table-column>
        		<el-table-column align="center" label="评论审核"  class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button  v-if="scope.row.status==0" type="primary" size="mini" @click="comPass(scope.row)">通过</el-button><br/>
                        <el-button  v-if="scope.row.status==0" type="danger" size="mini" @click="comRefuse(scope.row)">拒绝</el-button>
                    </template>
                </el-table-column>

        	</el-table>
        </el-dialog>
        <!--专家评论对话框-->
        <el-dialog title="专家评论" :close-on-click-modal="false" :visible.sync="expertFormVisible" >
        	<el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left"  label-width="18%" style="width: 90%; margin-left:50px;">
        		<el-form-item label="用户ID" prop="userId">
                    <span>{{dataForm.userId}}</span>
                </el-form-item>
                <el-form-item label="视频描述" prop="description">
            	    <span>{{dataForm.description}}</span>
                </el-form-item>
                <el-form-item label="视频" prop="url">
            	    <video  id="myvideo" :src="dataForm.url"   :muted="muteStatus" :autoplay="playStatus"  height="250" width="400" controls>
                    your browser does not support the video tag
                    </video>
                </el-form-item>
                <el-form-item label="审核状态" prop="status"> 
            	    <span><el-tag>{{audit[dataForm.status]}}</el-tag></span>
                </el-form-item>
                <el-form-item label="申请发布时间" prop="addTime">
            	    <span>{{dataForm.addTime}}</span>
                </el-form-item>
                <el-form-item label="专家评论">
                	<div class="expert">
                	<el-table  :data="expertComments" element-loading-text="正在查询中。。。" border fit highlight-current-row height="100%" style="width:60%">
                		
        		        <el-table-column align="center" label="专家名" prop="userName"/>   		
        		        <el-table-column align="center" label="评论" prop="comment"/>
        		        <el-table-column align="center" label="评论时间" prop="addTime"/>
                	</el-table>
                	<el-button class="circlebtn" v-if="!isShow" type="primary" icon="el-icon-plus" circle @click="handleAdd"></el-button>
                	 <el-button class="circlebtn" v-if="isShow" type="danger" icon="el-icon-minus" circle @click="handleMinus"></el-button>
                	<!-- <el-input style="width:70%;margin-top:0.4rem" v-model="expertComment.userName" placeholder="请输入专家姓名"/>
                	<el-input type="textarea" :row="3" style="width:70%;margin-top:0.4rem" v-model="expertComment.comment" placeholder="请输入评论"/> -->
                    </div>
                </el-form-item>
                <el-form-item label="专家姓名" v-if="isShow" prop="userName">
                	<el-input v-model="expertComment.userName" style="width:60%"/>
                </el-form-item>
                <el-form-item label="专家评论" v-if="isShow" prop="comment">
                	<div class="expert">
                	<el-input type="textarea" :row="4" v-model="expertComment.comment" style="width:60%"/>
                	<el-button class="commentbtn" type="primary" @click="toComment">评论</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>

     
	</div>
</template>
<script>
	import Pagination from '@/components/Pagination'
	import {listUserVideo,auditVideo,auditComment,commentVideo} from '@/api/video'
	export default{
		name:'userVideo',
		inject:['reload'],
		components:{Pagination},
		data(){
			return{
				listQuery:{
					audit_result:undefined,
					page:1,
					limit:20,
					sort:'add_time',
					order:'desc'
				},
				downQuery:{
					audit_result:undefined,
					page:1,
					limit:-1,
					sort:'add_time',
					order:'desc'
				},
				list:[],
				comments:[],
				expertComments:[],
				downloadList:[],
				listLoading:false,
				commentLoading:false,

				downloadLoading:false,
				auditLoading:false,//审核加载
				total:0,
				dialogFormVisible:false,
				commentFormVisible:false,
				expertFormVisible:false,
				dialogStatus: '',
				audit:['待审核','通过','不通过'],
				commentType:['普通','专家'],
				commentStatus:['待审核','通过','拒绝'],
				videoUrl:undefined,
				videoDialogVisible:false,
				playStatus:false,
                muteStatus:'',
				dataForm:{
					userId:undefined,
					description:undefined,
					url:undefined,
					status:undefined,
					addTime:undefined,
					auditAdminId:undefined,
					auditFeedback:undefined,
					result:undefined
				},
				auditLoading:false,
				rules:{
					result:[{required: true, message: '请选择是否通过', trigger: 'blur'}]
				},
				auditInfo:{
					userVideoResIds:[],
					feedback:undefined,
					result:undefined
				},
				auditComment:{
					videoId:undefined,
					userVideoCommentIds:[],
					feedback:undefined,
					result:undefined

				},
				expertComment:{
					userVideoId:undefined,
					userName:undefined,
					comment:undefined,
					type:1
				},
				isShow:false

			}
		},
		created(){
			this.getList()
		},
		watch:{
			'list':function(val,oldVal){
				if(this.commentFormVisible==true){
					this.$message({
							type:'success',
							message:'审核成功'
						})
					    var comments1=[]
						//this.commentFormVisible=false
						for(var i in this.list){
							if(this.list[i].id==this.auditComment.videoId){
								for(var j in this.list[i].comments){
									if(this.list[i].comments[j].type==0){
										comments1.push(this.list[i].comments[j])
									}
								}
								this.comments=comments1
								//this.$set(this.comments,'',this.list[i].comments)
								break
							}
						}
				}
				if(this.expertFormVisible==true){
					this.$message({
						type:'success',
						message:'评论成功'
					})
					var expertComments1=[]
					//this.expertComments=[]
					for(var i in this.list){
						if(this.list[i].id==this.expertComment.userVideoId){
							for(var j in this.list[i].comments){
								if(this.list[i].comments[j].type==1){
									expertComments1.push(this.list[i].comments[j])
								}
							}
							this.expertComments=expertComments1
							break
						}
					}
				}
			}
		},
		methods:{
			getList(){
				this.listLoading=true
				listUserVideo(this.listQuery).then((res)=>{
					this.list=res.data.data.items
					//this.$set(this.list,'comments')
					this.total=res.data.data.total
					this.listLoading=false
				}).catch((err)=>{
					this.list=[]
					this.total=0
					this.listLoading=false
				})
			},
			getDownList(){
				listUserVideo(this.downQuery).then((res)=>{
					this.downloadList=res.data.data.items
					import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = [
                        '视频ID',
                        '用户ID',
                        '视频描述',
                        '视频链接',
                        '申请发布时间',
                        '审核状态',
                        '审核人员',
                        '审核意见'
                    ]
                    const filterVal = ['id', 'userId', 'description', 'url', 'addTime','status','auditAdminId','auditFeedback']
                    excel.export_json_to_excel2(
                        tHeader,
                        this.downloadList,
                        filterVal,
                        '用户视频'
                    )
                    this.downloadLoading = false
                })
					//console.log(this.downloadList)
					
				}).catch((err)=>{
					this.downloadList=[]
					
				})
			},
			handleFilter(){
				this.listQuery.page=1
				this.getList()
			},
			handleDownLoad(){
				if(!this.downloadLoading){
					this.downloadLoading=true
					this.downQuery=this.listQuery
				    this.downQuery.limit=-1
				    this.getDownList()
				    //console.log(this.downloadList)
				    
				}
				

			},
			handleAudit(row){
				this.dialogFormVisible=true
				this.dataForm = Object.assign({}, row)
			},
			resetAuditInfo(){
				this.auditInfo={
					userVideoResIds:[],
					feedback:undefined,
					result:undefined
				}
			},
			auditVideo(){
				this.resetAuditInfo()
				this.$refs.dataForm.validate(valid=>{
					if(valid && !this.auditLoading){
						this.auditLoading=true
						this.auditInfo.userVideoResIds.push(this.dataForm.id)
						this.auditInfo.feedback=this.dataForm.auditFeedback
						this.auditInfo.result=this.dataForm.result
						auditVideo(this.auditInfo).then((res)=>{
							this.auditLoading=false
							this.listQuery.page=1
							this.getList()
							this.dialogFormVisible=false
							this.$notify.success({
								title: '成功',
                                message: '审核成功'
                            })
						}).catch((err)=>{
							this.auditLoading=false
							//this.getList()
							this.dialogFormVisible=false
							this.$notify.error({
								title: '失败',
                                message: '审核失败'
                            })
						})
					}else{
						return false
					}
				})
			},
			handleComment(row){
				this.commentFormVisible=true
				var comments1=[]
				this.comments=[]
				for(var i in row.comments){
					if(row.comments[i].type==0){
						comments1.push(row.comments[i])
					}
				}
				this.comments=comments1
			},

			comPass(row){
				this.auditComment.videoId=row.userVideoId
				this.auditComment.userVideoCommentIds=[]
				this.auditComment.userVideoCommentIds.push(row.id)
				this.auditComment.result=0
				auditComment(this.auditComment).then((res)=>{
					if(res.data.errno==0){
						this.getList()
						//console.log(this.list)
						
						//console.log(this.comments)
						//this.reload()
						//this.commentFormVisible=true
						
					}else{
						this.$message({
							type:'error',
							message:res.data.errmsg
						})
					}
				}).catch((err)=>{
					console.log(err)
				})
			},
			comRefuse(row){
				this.auditComment.videoId=row.userVideoId
				this.auditComment.userVideoCommentIds=[]
				this.auditComment.userVideoCommentIds.push(row.id)
				this.auditComment.result=1
				auditComment(this.auditComment).then((res)=>{
					if(res.data.errno==0){
						this.getList()

						
						
					}else{
						this.$message({
							type:'error',
							message:res.data.errmsg
						})
					}
				}).catch((err)=>{
					console.log(err)
				})
			},
			handleExpert(row){
				this.expertFormVisible=true
				this.isShow=false
				this.expertComments=[]
				var expertComments1=[]
				this.dataForm = Object.assign({}, row)
				for(var i in row.comments){
					if(row.comments[i].type==1){
						expertComments1.push(row.comments[i])
					}
				}
				this.expertComments=expertComments1
			},
			handleAdd(){
				this.isShow=true
				this.expertComment.userVideoId=this.dataForm.id
				this.expertComment.userName=undefined
				this.expertComment.comment=undefined

			},
			handleMinus(){
				this.isShow=false
			},
			toComment(){
				commentVideo(this.expertComment).then((res)=>{
					if(res.data.errno==0){
						this.getList()
						this.expertComment.userName=undefined
						this.expertComment.comment=undefined
					}else{
						this.$message({
							type:'error',
							message:res.data.errmsg
						})
					}
				}).catch((err)=>{
					console.log(err)
				})
			}

		}
	}
</script>
<style>
.expert{
	display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction:row;
}
.circlebtn{
	width:35px;
	height:35px;
	margin-top:40px;
	margin-left:10px;
}
.commentbtn{
	margin-top:19px;
	margin-left:10px;
}
</style>
