<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-input v-model="listQuery.userId" class="filter-item" style="width:180px;"placeholder="请输入用户ID" clearable />
			<el-select v-model="listQuery.categoryId" class="filter-item" placeholder="请选择类目" clearable>
				<el-option v-for="(category,index) in categoryList" :key="category.id" :label="category.name" :value="category.id"/>
			</el-select>
			<el-select v-model="listQuery.checkStatus" class="filter-item" placeholder="请选择回复状态" clearable>
				<el-option v-for="(item,index) in checkStatus" :key="index" :label="item" :value="index"/>
			</el-select>
			<el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">查找</el-button>

		</div>
		<!--查询结果-->
		<div style="height: calc(100% - 155px);overflow: hidden">
			<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                <el-table-column align="center" label="ID" prop="id"/>
                <el-table-column align="center" label="用户ID" prop="uid"/>
                <el-table-column align="center" label="用户备注" prop="remark"/>
                <el-table-column align="center" label="类目" prop="category"/>
                
                <el-table-column align="center" label="回复状态" prop="checkStatus">
                	<template slot-scope="scope">
                		<el-tag>{{checkStatus[scope.row.checkStatus]}}</el-tag>
                	</template>
                </el-table-column>
                
                <el-table-column align="center" label="测试时间" prop="addTime"/>
                <!-- <el-table-column align="center" label="反馈时间" prop="updateTime"/> -->
                <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleFeedback(scope.row)">反馈</el-button>
                        <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>
        <!--反馈-->
        <el-dialog title="反馈"   :visible.sync="dialogFormVisible" :close-on-click-modal="false" :top="'0'">
			<el-form ref="dataForm"  :model="dataForm" :rules="rules" status-icon label-position="left"
                     label-width="80px" style="width: 400px; margin-left:50px;">
                <el-form-item label="选择题" v-if="dataForm.choiceQuestion">
                	<ul v-for="(item,index) in dataForm.choiceQuestion">
                		<li>
                			问题{{index+1}}：{{item.content}}
                			<div v-for="(item1,index1) in item.questionItems">
                				<div v-if="item1.isChosen">用户选择：{{item1.identityId}}</div>
                				<div v-if="item1.isTrue">正确答案：{{item1.identityId}}</div>
                			</div>
                		</li>
                	</ul>
                </el-form-item>
                <el-form-item label="问答题" v-if="dataForm.essayQuestion">
                	<ul v-for="(item,index) in dataForm.essayQuestion">
                	    <li>
                			问题{{index+1}}：{{item.content}}
                			<div >
                				用户回答：{{item.answerText}}
                			</div>
                		</li>
                	</ul>
                </el-form-item>
                <el-form-item label="图片" v-if="dataForm.picUrls">
                	<ul class="ve">
                        <li v-for="(item,index) in dataForm.picUrls" >
                            <div class="picDiv"><img :src="item" class="pics"></div>
                                
                            
                        </li>
                    </ul>
                	
                    
                </el-form-item>
                <el-form-item label="视频">
                	<ul v-for="(item,index) in dataForm.videoUrls">
                		<li>
                		 <video  :src="item"   height="250" width="400" controls>
                		 	your browser does not support the video tag
                        </video>
                        </li>
                	</ul>
                </el-form-item>
                <el-form-item label="反馈" style="width:700px;" prop="feedback" v-if="!feedbackFlag">
                	<editor :init="editorInit" v-model="dataForm.feedback"/>
                </el-form-item>
                <el-form-item label="反馈" v-if="feedbackFlag">
                	<span v-html="dataForm.feedback"></span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">

                <el-button @click="dialogFormVisible = false">取消</el-button>
                
                <el-button  type="primary" v-if="!feedbackFlag&&dataForm.feedback" @click="testFeedback">确定</el-button>
                <el-button v-else @click="dialogFormVisible = false">确定</el-button>
            </div>
        </el-dialog>
	</div>
</template>
<script>
	import Pagination from '@/components/Pagination'
	import Editor from '@tinymce/tinymce-vue'
	import {listGuideType,listFeedback,readTest,testFeedback} from '@/api/guidance'
	import {uploadClassIcon} from '@/api/fileUpload'
	export default{
		components:{Pagination,Editor},
		name:'guideFeedback',
		data(){
			return{
				list:[],
				total:0,
				listLoading:false,
				listQuery:{
					userId:undefined,
					checkStatus:undefined,
					categoryId:undefined,
					limit:20,
					page:1,
					sort:'add_time',
					order:'desc'
				},
				//获得类目
				listQuery1:{
					type:1,
					limit:-1
				},
				categoryList:[],
				checkStatus:['未回复','已回复'],
				dataForm:{
					feedback:undefined,
					picUrls:[],
					videoUrls:[],
					choiceQuestion:[],
					essayQuestion:[]
				},
				dialogFormVisible:false,
				//dialogFormVisible1:false,
				tipsFormVisible:false,
			    dialogStatus: '',
			    textMap: {
			    	update: '编辑',
                    create: '创建'
                },
                feedback:{
                	id:undefined,
                	feedback:''
                },
                feedbackFlag:false,
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
			this.getCategory()
			this.getList()
		},
		methods:{
			getCategory(){
				listGuideType(this.listQuery1).then((res)=>{
					this.categoryList=res.data.data.items
				})
			},
			getList(){
				this.listLoading=true
				listFeedback(this.listQuery).then((res)=>{
					if(res.data.errno==0){
						this.listLoading=false
						this.list=res.data.data.items
						this.total=res.data.data.total
					}else{
						this.listLoading=false
						this.list=[]
						this.total=0
					}
				})
			},
			handleFilter(){
				this.listQuery.page=1
				this.getList()
			},
			handleFeedback(row){
				this.dialogFormVisible=true
				this.feedbackFlag=row.checkStatus
				this.feedback.id=row.id
				var read={id:undefined}
				read.id=row.id
				readTest(read).then((res)=>{
					this.dataForm=res.data.data
					this.dataForm.choiceQuestion=[]
					this.dataForm.essayQuestion=[]
					if(!this.dataForm.feedback){
						this.dataForm.feedback=''
					}
					for(var i in this.dataForm.questionAndItems){
						if(this.dataForm.questionAndItems[i].type==0){
							this.dataForm.choiceQuestion.push(this.dataForm.questionAndItems[i])
						}else{
							this.dataForm.essayQuestion.push(this.dataForm.questionAndItems[i])
						}
					}

				})
			},
			testFeedback(){
				this.feedback.feedback=this.dataForm.feedback
				testFeedback(this.feedback).then((res)=>{
					if(res.data.errno==0){
						this.getList()
						this.dialogFormVisible=false
						this.$notify.success({
							title:'成功',
							message:'反馈成功'
						})
					}else{
						this.$notify.error({
							title:'失败',
							message:res.data.errmsg
						})
					}
				})
			}
		}
	}
</script>
<style scope>
.choice{

}
.el-form-item ul{
	margin:0;
	padding-left:0;
	
}
.el-form-item ul li{
	list-style-type:none;
}
.logo{
	 width: 145px;
        height: 145px;
        display: block;
}
.pic{
	
}
.pic ul{

}
.picDiv {
        position: relative;
    }

    ul.ve {
        padding-left: 0px;
    }

    ul.ve li {
        list-style-type: none;
        display: inline-block;
    }

   ul.ve li .pics {
        width: 145px;
        height: 145px;
        display: block;
        padding-left:0.5rem;
    }
    .el-dialog {
        width: 800px;
    }
</style>