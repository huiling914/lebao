<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入课程ID"/>
            <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;"
                      placeholder="请输入课程名称"/>
            <el-button v-permission="['GET /admin/brand/list']" class="filter-item" type="primary" icon="el-icon-search"
                       @click="handleFilter">查找
            </el-button>
            <el-button v-if="listQuery.schoolId==undefined" v-permission="['POST /admin/brand/create']"
                       class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate" disabled>添加
            </el-button>
            <el-button v-else v-permission="['POST /admin/brand/create']" class="filter-item" type="primary"
                       icon="el-icon-edit" @click="handleCreate">添加
            </el-button>
            <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
            <el-button class="filter-item"  type="danger" icon="el-icon-delete" @click="handleSelectionDelete">删除</el-button>
             <el-button v-if="listQuery.schoolId==undefined" v-permission="['POST /admin/brand/create']"
                       class="filter-item" type="primary" icon="el-icon-edit" @click="handleImport" disabled>批量导入
            </el-button>
            <el-button v-else v-permission="['POST /admin/brand/create']" class="filter-item" type="primary"
                       icon="el-icon-edit" @click="handleImport">批量导入
            </el-button>
        </div>

        <!-- 查询结果 -->
        <div style="height: calc(100% - 155px);overflow: hidden">
            <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%" @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column align="center" label="课程ID" prop="id"/>

                <el-table-column align="center" label="课程名称" prop="name"/>
                <el-table-column align="center" label="上课时间" prop="timeDescription"/>
                <el-table-column align="center" label="课程老师" prop="teachers"/>
                <el-table-column align="center" label="课程专柜价格" prop="counterPrice"/>
                <el-table-column align="center" label="课程零售价格" prop="retailPrice"/>
                <el-table-column align="center" label="所属学校" prop="schoolName"/>
                <!--  <el-table-column align="center" property="picUrl" label="学校图片">
                   <template slot-scope="scope">
                     <img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="80">
                   </template>
                 </el-table-column> -->


                <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button v-permission="['POST /admin/brand/update']" type="primary" size="mini"
                                   @click="handleUpdate(scope.row)">编辑
                        </el-button>
                        <el-button v-permission="['POST /admin/brand/delete']" type="danger" size="mini"
                                   @click="deleteClass(scope.row.id)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>

        <!-- 添加或修改对话框 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :top="'0'">
            <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left"
                     label-width="100px" style="width: 400px; margin-left:50px;">
                <el-form-item label="课程名称" prop="name">
                    <el-input v-model="dataForm.name"/>
                </el-form-item>
                <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker
                        v-model="dataForm.startTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker
                        v-model="dataForm.endTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="上课时间" prop="timeDescription">
                    <el-input v-model="dataForm.timeDescription"/>
                </el-form-item>
                <el-form-item label="课程老师" prop="teacherIds">
                    <el-select v-model="dataForm.teacherIds" multiple placeholder="请选择">
                        <el-option
                            v-for="item in teacherList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程专柜价" prop="counterPrice">
                    <el-input v-model="dataForm.counterPrice"/>
                </el-form-item>
                <el-form-item label="课程零售价" prop="retailPrice">
                    <el-input v-model="dataForm.retailPrice"/>
                </el-form-item>
                <el-form-item label="开课人数" prop="maxStudent">
                    <el-input v-model="dataForm.maxStudent"/>
                </el-form-item>
                <el-form-item label="介绍" prop="description">
                    <el-input v-model="dataForm.description"/>
                </el-form-item>
                <el-form-item label="课程logo图">
                    <img v-if="picFlag" :src="dataForm.pictureUrl" class="logo">
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
                <el-form-item label="课程宣传图">
                    <ul>
                        <li v-for="(item,index) in dataForm.detailPictures" v-if="!item.video&&item.picUrl">
                            <div class="picDiv"><img v-if="item.picUrl" :key="item.picId"
                                                     :src="item.picUrl"
                                                     class="pics">
                                <el-button class="delete" type="danger" icon="el-icon-delete" circle
                                           @click="deletePic(index,item.picId)"></el-button>
                            </div>
                        </li>
                    </ul>
                    <el-upload
                        class="upload-uploader"
                        ref="upload2"
                        :headers="headers"
                        multiple
                        :limit="5"
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
                <el-form-item label="宣传视频">
                   <video v-if="hasvideo" id="myvideo" :src="videoSrc"  :poster="videoPic" :muted="muteStatus" :autoplay="playStatus"  height="250" width="400" controls>
                    your browser does not support the video tag
                     </video>
                    
                    <el-upload
                        class="upload-uploader"
                        ref="upload5"
                        :headers="headers"
                        :limit="1"
                        :file-list="fileList"
                        action="111"
                        :http-request="uploadFile5"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload5">
                            上传到服务器
                        </el-button>
                         <div slot="tip" class="el-upload__tip">只能上传.mp4文件，且不超过10M</div>
                         <div v-if="isuploading" slot="tip" class="el-upload__tip">请稍等，文件正在上传中......</div>
                    </el-upload>
                </el-form-item>
                <!-- <el-form-item label="品牌商图片" prop="picUrl">
                  <el-upload
                    :headers="headers"
                    :action="uploadPath"
                    :show-file-list="false"
                    :on-success="uploadPicUrl"
                    class="avatar-uploader"
                    accept=".jpg,.jpeg,.png,.gif">
                    <img v-if="dataForm.picUrl" :src="dataForm.picUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"/>
                  </el-upload>
                </el-form-item> -->

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="addClass">确定</el-button>
                <el-button v-else type="primary" @click="updateClass">确定</el-button>
            </div>
        </el-dialog>

         <!-- 批量导入对话框 -->
        <el-dialog title="批量导入" :visible.sync="dialogImportVisible" :top="'0'">
            <el-form  status-icon label-position="left"
                     label-width="100px" style="width: 400px; margin-left:50px;">
                <el-form-item  prop="fileUrl">
                   <!-- <el-input v-model="fileUrl" placeholder="显示文件地址"/>-->
                     <el-upload
                        class="upload-uploader"
                        ref="upload3"
                        :headers="headers"
                        :limit="1"
                        :file-list="fileList"
                        action="111"
                        :http-request="uploadFile3"
                        :auto-upload="false"
                        list-type="picture"
                        accept=".xls,.xlsx">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload3">
                            开始上传
                        </el-button>
                    </el-upload>
                </el-form-item>
                
               
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogImportVisible = false">关闭</el-button>
                <!--<el-button v-if="dialogStatus=='create'" type="primary" @click="createTeacher">确定</el-button>
                <el-button v-else type="primary" @click="updateTeacher">确定</el-button>-->
            </div>
        </el-dialog> 
    </div>
</template>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }

    .avatar {
        width: 145px;
        height: 145px;
        display: block;
    }

    .picDiv {
        position: relative;
    }

    ul {
        padding-left: 0px;
    }

    ul li {
        list-style-type: none;
        display: inline-block;
    }

    ul li .pics {
        width: 145px;
        height: 145px;
        display: block;
    }

    ul li .delete {
        position: absolute;
        top: 55px;
        margin-left: 55px;
        background: red;
        display: block;
        opacity: 0.1;
    }

    .delete:hover {
        display: block;
        opacity: 1;
    }

    .logo {
        width: 145px;
        height: 145px;
        display: block;
    }
</style>

<script>
    import {listBrand, createBrand, updateBrand, deleteBrand} from '@/api/brand'
    import {uploadPath, uploadHeaderPath} from '@/api/storage'
    import {getToken} from '@/utils/auth'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import {listClass, AddClass, UpdateClass, DeleteClass, listTeacher,classDetail} from '@/api/school'
    import {uploadClassIcon, uploadClassDetailPic,importClass,uploadClassVideo} from '@/api/fileUpload'
    import {handleDownload} from '@/utils/commen'
    export default {
        name: 'Class',
        components: {Pagination},
        data() {
            return {
                uploadPath,
                uploadHeaderPath,
                picFlag:undefined,
                list: undefined,
                teacherList: [],
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    id: undefined,
                    schoolId: undefined,
                    name: undefined,
                    sort: undefined,
                    order: undefined
                },
                listQuery1: {
                    schoolId: undefined,
                },

                deletedInfo: {
                    classIds: []
                },
                selectionList:[],
                teacherIds:[],
                dataForm: {
                    id: undefined,
                    name: '',
                    schoolId: undefined,
                    description: '',
                    startTime: '',
                    endTime: '',
                    timeDescription: undefined,
                    counterPrice: undefined,
                    retailPrice: undefined,
                    maxStudent: undefined,
                    //teacherIds: undefined,
                    status: 0,
                    updateList: [],
                    uploadList: [],
                    deleteList: [],
                    detailPictures: []
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '创建'
                },
                rules: {
                    name: [
                        {required: true, message: '课程名称不能为空', trigger: 'blur'}
                    ],
                    counterPrice: [
                        {required: true, message: '课程专柜价格不能为空', trigger: 'blur'},
                        {pattern:/^[0-9]+.?[0-9]*$/, message: '课程专柜价格必须位数字', trigger: 'blur'}
                    ],
                    retailPrice: [
                        {required: true, message: '课程专柜价格不能为空', trigger: 'blur'},
                        {pattern:/^[0-9]+.?[0-9]*$/, message: '课程零售价格必须位数字', trigger: 'blur'}
                    ],
                    startTime: [
                        {required: true, message: '课程开始时间不能为空', trigger: 'blur'},
                        
                    ],
                    maxStudent: [
                        {required: true, message: '课程最大人数不能为空', trigger: 'blur'},
                        {pattern:/^[0-9]*[1-9][0-9]*$/, message: '课程最大人数必须位整数', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '课程类型不能为空', trigger: 'blur'}
                        
                    ],
                    pictureUrl: [
                        {required: true, message: '课程列表图片不能为空', trigger: 'blur'}
                        
                    ]
                },
                downloadLoading: false,
                fileList: [],
                //批量导入
                dialogImportVisible:false,
                //上传视频
                fileData5: undefined,
                videoSrc:undefined,
                hasvideo:false,
                playStatus:false,
                muteStatus:'',
                isPlay:false,
                isuploading:false,
                videoPic:undefined
            }
        },
        computed: {
            headers() {
                return {
                    'X-Litemall-Admin-Token': getToken()
                }
            }
        },
        created() {
            this.listQuery.schoolId = this.$route.params.schoolId;
            this.listQuery1.schoolId = this.$route.params.schoolId;
            this.getList();
            if(this.listQuery1.schoolId!=undefined){
                this.getTeacherList(this.listQuery1);
            }
            
        },
        watch:{
          'listQuery.id':function(val,oldVal){
            if(!val){
              this.getList()
            }
          },
          'listQuery.name':function(val,oldVal){
            if(!val){
              this.getList()
            }
          }
          
        },
        methods: {
            getList() {
                this.listLoading = true
                listClass(this.listQuery)
                .then(response => {
                    console.log(response)
                    this.list = response.data.data.items
                    for (var i = 0; i < this.list.length; i++) {
                        this.list[i]['teachers'] = '';
                        this.list[i]['teacherIds'] = []
                        for (var j = 0; j < this.list[i]['litemallTeacherList'].length; j++) {
                            if (this.list[i]['litemallTeacherList'][j] != null) {
                                this.list[i]['teachers'] = this.list[i]['teachers'] + this.list[i]['litemallTeacherList'][j].name + ' ';
                                this.list[i]['teacherIds'].push(this.list[i]['litemallTeacherList'][j].id)
                            }

                        }
                        //console.log('22'+this.list[i]['teachers']);
                        //  if(this.list[i].detailPictures){
                        //    //console.log('aaaa')
                        //  for (var j=0;j<this.list[i].detailPictures.length;j++) {
                        //      if(this.list[i].detailPictures[j].picUrl.substr(0,4)!='http'){
                        //      this.list[i].detailPictures[j].picUrl=uploadHeaderPath+this.list[i].detailPictures[j].picUrl
                        //   }
                        //  }
                        // }
                    }
                    this.total = response.data.data.total
                    this.listLoading = false
                })
                .catch(() => {
                    this.list = []
                    this.total = 0
                    this.listLoading = false
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
                    self.dataForm.pictureUrl = response.data.data[0]
                    self.picFlag=1

                    
                    //console.log(response.data.data[0])
                    //self.uploadlogoUrl=response.data.data[0]
                    //console.log(self.dataForm.logoUrl)
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            uploadFile2(file) {
                this.fileData2.append('files', file.file)
            },
            //确定上传
            submitUpload2() {
                this.fileData2 = new FormData();
                var self = this
                this.$refs.upload2.submit();
                uploadClassDetailPic(this.fileData2).then(function (response) {
                    self.$refs.upload2.clearFiles();
                    console.log(response)
                    for (var key in response.data.data) {
                        self.dataForm.uploadList.push({'id': null, 'url': response.data.data[key]})
                        self.dataForm.detailPictures.push({'id': null, 'picUrl': response.data.data[key]})
                        console.log(self.dataForm.detailPictures)
                    }
                    // for(var i in self.dataForm.detailPictures){
                    //       if(self.dataForm.detailPictures[i].picUrl.substr(0,4)!='http'){
                    //         self.dataForm.detailPictures[i].picUrl=uploadHeaderPath+self.dataForm.detailPictures[i].picUrl
                    //           }
                    //       }
                    self.$message({
                        message: '上传成功',
                        type: 'success'
                    })
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
                        //上传视频
            uploadFile5(file) {
                this.fileData5.append('files', file.file);
                //console.log(this.fileData5.get("file"))
            },
//确定上传
            submitUpload5() {
                this.isuploading=true
                this.fileData5 = new FormData();
                this.$refs.upload5.submit();
                var self = this
                uploadClassVideo(this.fileData5).then(function (response) {
                    console.log(11111)
                    console.log(response)
                    self.$refs.upload5.clearFiles();
                    self.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                    self.dataForm.videoUrl =response.data.data//用于表单提交
                    self.hasvideo=true
                    self.videoSrc=response.data.data//用于页面展示
                    self.videoPic=self.videoSrc+'?x-oss-process=video/snapshot,t_10000,m_fast,w_800'
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

            //删除图片
            deletePic(index, picId) {
                this.dataForm.detailPictures.splice(index, 1)
                this.dataForm.deleteList.push(picId)
            },
            getTeacherList(params) {
                //this.listLoading = true
                listTeacher(params)
                .then(response => {
                    this.teacherList = response.data.data.items
                    //this.total = response.data.data.total
                    //this.listLoading = false
                })
                .catch(() => {
                    this.teacherList = []
                    //this.total = 0
                    //this.listLoading = false
                })
            },
            addClass() {
                this.dataForm.schoolId = this.$route.params.schoolId;
                var reg=/^[0-9]*[1-9][0-9]*$/;
                if(!this.dataForm.name){
                    this.$message.error('请输入课程名称！');
                }else if(!this.dataForm.startTime){
                    this.$message.error('请输入课程开始时间！');
                }else if(!this.dataForm.counterPrice||isNaN(this.dataForm.counterPrice)){
                    this.$message.error('请正确输入课程专柜价！');
                }else if(!this.dataForm.retailPrice||isNaN(this.dataForm.retailPrice)){
                    this.$message.error('请正确输入课程零售价！');
                }else if(!this.dataForm.maxStudent||!reg.test(this.dataForm.maxStudent)){
                    this.$message.error('请正确输入课程最大人数！')
                }else if(!this.dataForm.pictureUrl){
                    this.$message.error('请上传课程列表图片！')
                }else{
                    AddClass(this.dataForm).then((response) => {
                    //this.list.unshift(response.data.data.items)
                    this.getList();
                    this.dialogFormVisible = false
                    this.$notify.success({
                        title: '成功',
                        message: '创建成功'
                    })
                }).catch((error) => {
                    this.$notify.error({
                        title: '失败',
                        message: response.data.errmsg
                    })
                })
                }
                
            },
            updateClass() {
                //this.dataForm['teacherIds']=this.teacherIds
                var reg=/^[0-9]*[1-9][0-9]*$/;
                if(!this.dataForm.name){
                    this.$message.error('请输入课程名称！');
                }else if(!this.dataForm.startTime){
                    this.$message.error('请输入课程开始时间！');
                }else if(!this.dataForm.counterPrice||isNaN(this.dataForm.counterPrice)){
                    this.$message.error('请正确输入课程专柜价！');
                }else if(!this.dataForm.retailPrice||isNaN(this.dataForm.retailPrice)){
                    this.$message.error('请正确输入课程零售价！');
                }else if(!this.dataForm.maxStudent||!reg.test(this.dataForm.maxStudent)){
                    this.$message.error('请正确输入课程最大人数！')
                }else if(!this.dataForm.pictureUrl){
                    this.$message.error('请上传课程列表图片！')
                }else{
                    UpdateClass(this.dataForm).then((response) => {
                    // for (const v of this.list) {
                    //   if (v.id === this.dataForm.id) {
                    //     const index = this.list.indexOf(v)
                    //     this.list.splice(index, 1, this.dataForm)
                    //     break
                    //   }
                    // }
                    this.getList();
                    this.dialogFormVisible = false
                    this.$notify.success({
                        title: '成功',
                        message: '更新成功'
                    })
                }).catch((error) => {
                    this.$notify.error({
                        title: '失败',
                        message: response.data.errmsg
                    })
                })
                }
                
            },
            deleteClass(id) {
                this.deletedInfo.classIds[0] = id
                DeleteClass(this.deletedInfo).then((response) => {
                    this.$notify.success({
                        title: '成功',
                        message: '删除成功'
                    })
                    // const index = this.list.indexOf(row)
                    // this.list.splice(index, 1)
                    this.getList();
                }).catch((error) => {
                    this.$notify.error({
                        title: '失败',
                        message: response.data.errmsg
                    })
                })
            },
             //多选 
            handleSelectionChange: function (val) {
                this.selectionList = val;
                console.log(this.selectionList)
            },
            //批量删除
            handleSelectionDelete: function () {
                var deletelist = [];
                for(let i =0;i<this.selectionList.length;i++){
                    deletelist.push(this.selectionList[i].id)
                }

                if(deletelist.length==0){
                    this.$notify.error({
                        title: '失败',
                        message: "请选择要删除的记录"
                    })
                }else{
                    this.deletedInfo.classIds=deletelist
                    DeleteClass(this.deletedInfo).then(response => {
                    this.$notify.success({
                        title: '成功',
                        message: '删除成功'
                    })
                    this.getList()
                }).catch(response => {
                    this.$notify.error({
                        title: '失败',
                        message: response.data.errmsg
                    })
                })
                }
                
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getList()
            },
            resetForm() {
                this.dataForm = {
                    id: undefined,
                    name: '',
                    schoolId: undefined,
                    description: '',
                    startTime: '',
                    endTime: '',
                    timeDescription: undefined,
                    counterPrice: undefined,
                    retailPrice: undefined,
                    maxStudent: undefined,
                    teacherIds: [],
                    status: 0,
                    updateList: [],
                    uploadList: [],
                    deleteList: [],
                    detailPictures: []
                }
            },
            handleCreate() {
                this.resetForm()
                this.picFlag=0
                console.log(this.dataForm)
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                this.videoSrc=''
                this.hasvideo=false
                this.videoPic=undefined
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            uploadPicUrl: function (response) {
                this.dataForm.picUrl = response.data.url
            },
            createData() {
                this.$refs['dataForm'].validate(valid => {
                    if (valid) {
                        createBrand(this.dataForm)
                        .then(response => {
                            this.list.unshift(response.data.data)
                            this.dialogFormVisible = false
                            this.$notify.success({
                                title: '成功',
                                message: '创建成功'
                            })
                        })
                        .catch(response => {
                            this.$notify.error({
                                title: '失败',
                                message: response.data.errmsg
                            })
                        })
                    }
                })
            },
            handleUpdate(row) {
                //this.teacherList=[]
                //console.log('aaa')
                this.dialogStatus = 'update'
                this.dialogFormVisible = true
                this.videoSrc=''
                this.hasvideo=false
                this.dataForm = Object.assign({}, row)
                this.dataForm.deleteList = []
                this.dataForm.uploadList = []
                this.listQuery1.schoolId=this.dataForm.schoolId
                this.videoPic=undefined
                this.getTeacherList(this.listQuery1)
                if(this.dataForm.pictureUrl){
                        self.picFlag=1
                    }
                classDetail(row.id).then((response)=>{
                    
                    //this.dataForm.detailPictures=response.data.data.detailPictures
                    
                    if(!response.data.data.detailPictures){
                        this.dataForm.detailPictures=[]
                    }else{
                        this.dataForm.detailPictures=response.data.data.detailPictures
                        if(this.dataForm.detailPictures[0].video==1){
                            this.videoSrc=this.dataForm.detailPictures[0].picUrl
                            this.videoPic=this.videoSrc+'?x-oss-process=video/snapshot,t_10000,m_fast,w_800'
                            this.hasvideo=true
                        }
                    }                   
                }).catch((error)=>{
                    console.log(error)
                })
                //console.log(this.dataForm.litemallTeacherList)
                
                
                // this.$nextTick(() => {
                //     this.$refs['dataForm'].clearValidate()
                // })
            },
            updateData() {
                this.$refs['dataForm'].validate(valid => {
                    if (valid) {
                        updateBrand(this.dataForm)
                        .then(() => {
                            for (const v of this.list) {
                                if (v.id === this.dataForm.id) {
                                    const index = this.list.indexOf(v)
                                    this.list.splice(index, 1, this.dataForm)
                                    break
                                }
                            }
                            this.dialogFormVisible = false
                            this.$notify.success({
                                title: '成功',
                                message: '更新成功'
                            })
                        })
                        .catch(response => {
                            this.$notify.error({
                                title: '失败',
                                message: response.data.errmsg
                            })
                        })
                    }
                })
            },
            handleDelete(row) {
                deleteBrand(row)
                .then(response => {
                    this.$notify.success({
                        title: '成功',
                        message: '删除成功'
                    })
                    // const index = this.list.indexOf(row)
                    // this.list.splice(index, 1)
                    this.getList();
                })
                .catch(response => {
                    this.$notify.error({
                        title: '失败',
                        message: response.data.errmsg
                    })
                })
            },
            handleDownload() {
                this.downloadLoading = true
                const tHeader = [
                        '课程ID',
                        '课程名称',
                        '上课时间',
                        '课程老师',
                        '课程专柜价格',
                        '课程零售价格',
                        '所属学校'
                    ]
                const filterVal = ['id', 'name', 'timeDescription', 'teachers', 'counterPrice','retailPrice','schoolName']
                var downQuery=this.listQuery
                downQuery.limit=-1
                handleDownload(tHeader,filterVal,downQuery,'课程信息',listClass)
                this.downloadLoading=false
            },
             handleImport(row) {
               this.dialogImportVisible=true
               //this.dataForm.schoolId = this.listQuery.schoolId;
            },
            //
             uploadFile3(file) {
                this.fileData3.append('file', file.file)
                this.fileData3.append('schoolId', this.listQuery.schoolId)
            },
            //确定上传
            submitUpload3() {
                this.fileData3 = new FormData();
                var self = this
                this.$refs.upload3.submit();
                 console.log(this.fileData3.get("file"))
                console.log(this.fileData3.get("schoolId"))
                importClass(this.fileData3).then(function (response) {
                    self.$refs.upload3.clearFiles();
                    console.log(response)
                    
                    self.$message({
                        message: '上传成功',
                        type: 'success'
                    })
                    self.getList()
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
        }
    }
</script>
