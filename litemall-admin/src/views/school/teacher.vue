<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入教师ID"/>
            <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;"
                      placeholder="请输入教师名称"/>
            <el-select  v-if="listQuery.schoolId==undefined||flag==undefined" v-model="listQuery.schoolId" clearable  style="width: 200px" class="filter-item" filterable  remote placeholder="请输入学校名称"
               :remote-method="getSchools" :loading="loading">
                <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
            <el-button v-permission="['GET /admin/brand/list']" class="filter-item" type="primary" icon="el-icon-search"
                       @click="handleFilter">查找
            </el-button>
            <el-button v-if="listQuery.schoolId==undefined||flag==undefined" v-permission="['POST /admin/brand/create']"
                       class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate" disabled>添加
            </el-button>
            <el-button v-else v-permission="['POST /admin/brand/create']" class="filter-item" type="primary"
                       icon="el-icon-edit" @click="handleCreate">添加
            </el-button>
            <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
             <el-button class="filter-item"  type="danger" icon="el-icon-delete" @click="handleSelectionDelete">删除</el-button>
             <el-button v-if="listQuery.schoolId==undefined||flag==undefined" v-permission="['POST /admin/brand/create']"
                       class="filter-item" type="primary" icon="el-icon-upload2" @click="handleImport" disabled>批量导入
            </el-button>
            <el-button v-else v-permission="['POST /admin/brand/create']" class="filter-item" type="primary"
                       icon="el-icon-upload2" @click="handleImport">批量导入
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
                <el-table-column align="center" label="教师ID" prop="id"/>

                <el-table-column align="center" label="教师姓名" prop="name"/>
                <el-table-column align="center" label="性别" prop="gender">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.gender | genderFilter }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="身份证号" prop="identificationId"/>
                
                <el-table-column align="center" label="星级" prop="star"/>
                <el-table-column align="center" label="手机号" prop="phone"/>
                <el-table-column align="center" label="所属学校" prop="schoolName"/>
                <!-- <el-table-column align="center" property="picUrl" label="学校图片">
                  <template slot-scope="scope">
                    <img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="80">
                  </template>
                </el-table-column>
           -->


                <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button v-if="listQuery.schoolId==-1" v-permission="['POST /admin/brand/update']"
                                   type="primary"
                                   size="mini" @click="handleUpdate(scope.row)" disabled>编辑
                        </el-button>
                        <el-button v-else v-permission="['POST /admin/brand/update']" type="primary" size="mini"
                                   @click="handleUpdate(scope.row)">编辑
                        </el-button>
                        <el-button v-permission="['POST /admin/brand/delete']" type="danger" size="mini"
                                   @click="handleDelete(scope.row.id)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getTeacherList"/>

        <!-- 添加或修改对话框 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :top="'0'">
            <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left"
                     label-width="100px" style="width: 400px; margin-left:50px;">
                <el-form-item label="教师姓名" prop="name">
                    <el-input v-model="dataForm.name"/>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-select v-model="dataForm.gender" placeholder="请选择">
                        <el-option
                            v-for="item in option"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="身份证号" prop="identificationId">
                    <el-input v-model="dataForm.identificationId"/>
                </el-form-item>
                <el-form-item label="介绍" prop="description">
                    <el-input v-model="dataForm.description"/>
                </el-form-item>
                <el-form-item label="星级" prop="star">
                    <el-input v-model="dataForm.star"/>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="dataForm.phone"/>
                </el-form-item>
                <el-form-item label="教师列表图">
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
                <el-form-item label="教师宣传图">
                    <ul class="ve">
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
                <el-form-item label="视频封面">
                    <img v-if="dataForm.videoCoverUrl" :src="dataForm.videoCoverUrl" class="logo">
                    <el-upload
                        class="upload-uploader"
                        ref="upload4"
                        :headers="headers"
                        :limit="1"
                        :file-list="fileList"
                        action="111"
                        :http-request="uploadFile4"
                        :auto-upload="false"
                        list-type="picture">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload4">
                            上传到服务器
                        </el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="宣传视频">
                   <video v-if="hasvideo" id="myvideo" :src="videoSrc"  :poster="dataForm.videoCoverUrl" :muted="muteStatus" :autoplay="playStatus"  height="250" width="400" controls>
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createTeacher">确定</el-button>
                <el-button v-else type="primary" @click="updateTeacher">确定</el-button>
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
    }

   ul.ve li .delete {
        position: absolute;
        top: 55px;
        margin-left: 55px;
        background: red;
        display: block;
        opacity: 0.2;
    }

    ul.ve li .delete:hover {
        display: block;
        opacity: 1;
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

    import {listTeacher, AddTeacher, UpdateTeacher, DeleteTeacher,listSchool,teacherDetail} from '@/api/school'
    import {uploadPath, uploadHeaderPath} from '@/api/storage'
    import {getToken} from '@/utils/auth'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import {uploadTeacherIcon, uploadTeacherDeatilPic,importTeacher,uploadTeacherVideo} from '@/api/fileUpload'
    import {handleDownload} from '@/utils/commen'
    const genderMap = {
        0: '女',
        1: '男'
    }
    export default {
        name: 'Teacher',
        components: {Pagination},
        filters: {
            genderFilter(gender) {
                return genderMap[gender]
            }
        },
        data() {
            return {
                uploadPath,
                uploadHeaderPath,
                list: undefined,
                total: 0,
                listLoading: true,
                loading:true,
                schools:[],
                flag:undefined,//判断是否从学校入口进入
                findSchool:{
                    name:undefined,
                    limit:50
                },
                listQuery: {
                    page: 1,
                    limit: 20,
                    id: undefined,
                    schoolId: undefined,
                    name: undefined,

                },
                deleted: {
                    ids: undefined
                },
                selectionList:[],
                option: [
                    {
                        value: 0,
                        label: '女'
                    },
                    {
                        value: 1,
                        label: '男'
                    }
                ],
                
                dataForm: {
                    schoolId: undefined,
                    name: undefined,
                    gender: undefined,
                    identificationId: undefined,
                    pictureUrl: undefined,
                    description: undefined,
                    star: undefined, //float类型
                    phone: undefined,
                    updateList: [],
                    uploadList: [],
                    deleteList: [],
                    detailPictures: [],
                    videoUrl:undefined,
                    videoCoverUrl:undefined
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '创建'
                },
                rules: {
                    name: [
                        {required: true, message: '教师姓名不能为空', trigger: 'blur'}
                    ],
                    gender: [
                        {required: true, message: '教师性别不能为空', trigger: 'blur'}                       

                    ],
                    identificationId: [
                        {required: true, message: '教师身份证号不能为空', trigger: 'blur'},
                        {pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号无效', trigger: 'blur'}
                    ],
                    pictureUrl: [
                        {required: true, message: '教师列表图不能为空', trigger: 'blur'}
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
        watch:{
          'listQuery.id':function(val,oldVal){
            if(!val){
              this.getTeacherList()
            }
          },
          'listQuery.name':function(val,oldVal){
            if(!val){
              this.getTeacherList()
            }
          },
          'listQuery.schoolId':function(val,oldVal){
            if(!val){
              this.schools=[]
              this.getTeacherList()
            }
          }
          
        },
        created() {
            this.listQuery.schoolId = this.$route.params.schoolId
            this.flag=this.$route.params.flag
            console.log('aa')
            console.log(this.listQuery.schoolId)
            this.getTeacherList()
        },
        methods: {
            getList: function () {

            },
            getSchools(query){
                //console.log(query);
                if(query){
                    this.loading=true;
                    this.schools=[];
                    this.findSchool.name=query;
                    console.log(this.findSchool)
                    setTimeout(()=>{
                        this.loading=false;
                        listSchool(this.findSchool).then((response)=>{
                            console.log(response)
                            var schoollist=response.data.data.items;
                            for(var i=0;i<schoollist.length;i++){
                                this.schools.push({id:schoollist[i].id,name:schoollist[i].name+"  "+schoollist[i].address})
                            }
                            // this.schools=response.data.data.items.map(item=>{
                            //     return {value: item.id, label: item.name};
                            // })
                            console.log(this.schools)
                            
                        }).catch((error)=>{
                            console.log(error);
                        })

                    },200)
                }else{
                    this.schools=[];
                }


            },
            getTeacherList() {
                this.listLoading = true
                listTeacher(this.listQuery)
                .then(response => {
                    //console.log(response.data)
                    this.list = response.data.data.items
                    // for(var i=0;i<this.list.length;i++){
                    //   this.list[i].pictureUrl=uploadHeaderPath+this.list[i].pictureUrl
                    //   if(this.list[i].detailPictures){
                    //     console.log('aaaa')
                    //   for (var j=0;j<this.list[i].detailPictures.length;j++) {
                    //       if(this.list[i].detailPictures[j].picUrl.substr(0,4)!='http'){
                    //       this.list[i].detailPictures[j].picUrl=uploadHeaderPath+this.list[i].detailPictures[j].picUrl
                    //    }
                    //   }
                    //  }
                    //   //console.log(this.list[i].logoUrl.substr(0,4))
                    //  // if(this.list[i].pictures){
                    //  //  for (var j in this.list[i].pictures) {
                    //  //      if(this.list[i].pictures[j].picUrl.substr(0,4)!='http'){
                    //  //      this.list[i].pictures[j].picUrl=uploadHeaderPath+this.list[i].pictures[j].picUrl
                    //  //   }
                    //  //  }
                    //  // }
                    // }
                    console.log(this.list)
                    this.total = response.data.data.total
                    this.listLoading = false
                })
                .catch(() => {
                    this.list = []
                    this.total = 0
                    this.listLoading = false
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getTeacherList()
            },
            resetForm() {
                this.dataForm = {
                    schoolId: undefined,
                    name: undefined,
                    gender: undefined,
                    identificationId: undefined,
                    pictureUrl: undefined,
                    description: undefined,
                    star: undefined, //float类型
                    phone: undefined,
                    updateList: [],
                    uploadList: [],
                    deleteList: [],
                    detailPictures: [],
                    videoUrl:undefined,
                    videoCoverUrl:undefined
                }
            },
            handleCreate() {
                this.resetForm()
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                this.videoSrc=''
                this.hasvideo=false
                this.videoPic=undefined
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            uploadFile1(file) {
                this.fileData1.append('files', file.file);
                
            },
            submitUpload1() {
                this.fileData1 = new FormData();
                this.$refs.upload1.submit();
                var self = this
                uploadTeacherIcon(this.fileData1).then(function (response) {
                    self.$refs.upload1.clearFiles();
                    self.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                    //self.dataForm.logoUrl=uploadHeaderPath+response.data.data[0]
                    self.dataForm.pictureUrl = response.data.data[0]
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
                uploadTeacherDeatilPic(this.fileData2).then(function (response) {
                    self.$refs.upload2.clearFiles();
                    console.log(response)
                    for (var key in response.data.data) {
                        console.log(self.dataForm.uploadList)
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
            //上传视频封面
            uploadFile4(file) {
                this.fileData4.append('files', file.file)
                
            },
//确定上传
            submitUpload4() {
                this.fileData4 = new FormData();
                this.$refs.upload4.submit();
                var self = this
                uploadTeacherIcon(this.fileData4).then(function (response) {
                    console.log(response)
                    self.$refs.upload4.clearFiles();
                    self.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                    //self.dataForm.logoUrl=uploadHeaderPath+response.data.data[0]
                    self.$set(self.dataForm,'videoCoverUrl',response.data.data[0])
                   //self.dataForm.videoCoverUrl = response.data.data[0]
                    //console.log(response.data.data[0])
                    //self.uploadlogoUrl=response.data.data[0]
                    //console.log(self.dataForm.logoUrl)
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
                uploadTeacherVideo(this.fileData5).then(function (response) {
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
            createTeacher() {
                this.dataForm.schoolId = this.listQuery.schoolId;
                //console,log('12'+this.dataForm.schoolId);
                // this.dataForm.pictureUrl='http://www.lebao108.com/images/school/teacher/1.jpg';
                // this.dataForm.updateList=[];
                // this.dataForm.uploadList=[];
                // this.dataForm.deleteList=[];
                var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //验证身份证
                if(!this.dataForm.name){
                    this.$message.error('请输入教师姓名！');
                }else if(this.dataForm.gender==undefined){
                    this.$message.error('请选择教师性别！');
                }else if(!this.dataForm.identificationId||!reg.test(this.dataForm.identificationId)){
                    this.$message.error('请输入正确的身份证号！');
                        
                }else if(!this.dataForm.pictureUrl){
                    this.$message.error('请上传教师列表图！');
                }else{
                    AddTeacher(this.dataForm).then((response) => {

                    this.getTeacherList()
                    this.dialogFormVisible = false
                    this.$notify.success({
                        title: '成功',
                        message: '添加老师成功'
                    })
                }).catch((error) => {
                    this.$notify.error({
                        title: '失败',
                        message: response.data.errmsg
                    })
                })
                }
                
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
                this.dialogStatus = 'update'
                this.dialogFormVisible = true
                this.videoSrc=''
                this.hasvideo=false
                this.dataForm = Object.assign({}, row)
                this.dataForm.deleteList = []
                this.dataForm.uploadList = []
                this.videoPic=undefined
                teacherDetail(row.id).then((response)=>{                   
                    if (!response.data.data.detailPictures) {
                        this.dataForm.detailPictures = []
                    }else {
                        this.dataForm.detailPictures=response.data.data.detailPictures
                        this.dataForm.videoCoverUrl=response.data.data.videoCoverUrl
                        if(this.dataForm.detailPictures[0].video==1){
                            this.videoSrc=this.dataForm.detailPictures[0].picUrl
                            if(!this.dataForm.videoCoverUrl){
                                this.dataForm.videoCoverUrl=this.videoSrc+'?x-oss-process=video/snapshot,t_10000,m_fast,w_800'
                            }
                            this.hasvideo=true
                        }
                        
                        //console.log(this.videoSrc)
                    }
                    
                   
                }).catch((error)=>{
                    console.log(error)
                })
                //this.dataForm = Object.assign({}, row)
                
            },
            updateTeacher() {
                //this.dataForm.pictureUrl=this.dataForm.detailPictures[0].picUrl;
                //this.dataForm.updateList=[];
                //this.dataForm.uploadList=[];
                //this.dataForm.deleteList=[];
                var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //验证身份证
                if(!this.dataForm.name){
                    this.$message.error('请输入教师姓名！');
                }else if(this.dataForm.gender==undefined){
                    this.$message.error('请选择教师性别！');
                }else if(!this.dataForm.identificationId||!reg.test(this.dataForm.identificationId)){
                    this.$message.error('请输入正确的身份证号！');
                        
                }else if(!this.dataForm.pictureUrl){
                    this.$message.error('请上传教师列表图！');
                }else{
                    UpdateTeacher(this.dataForm).then((response) => {
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
                }).catch((error) => {
                    this.$notify.error({
                        title: '失败',
                        message: response.data.errmsg
                    })
                })
                }
                
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
                    this.deleted.ids=deletelist.join(',')
                    DeleteTeacher(this.deleted).then(response => {
                    this.$notify.success({
                        title: '成功',
                        message: '删除成功'
                    })
                    this.getTeacherList()
                }).catch(response => {
                    this.$notify.error({
                        title: '失败',
                        message: response.data.errmsg
                    })
                })
                }
                
            },
            handleDelete(id) {
                this.deleted.ids = id;
                DeleteTeacher(this.deleted)
                .then(response => {
                    this.$notify.success({
                        title: '成功',
                        message: '删除成功'
                    })
                    this.getTeacherList()
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
                        '教师ID',
                        '教师姓名',
                        '性别',
                        '身份证号',
                        '星级',
                        '手机号',
                        '所属学校'
                    ]
                const filterVal = ['id', 'name', 'gender', 'identificationId', 'star','phone','schoolName']
                var downQuery=this.listQuery
                downQuery.limit=-1
                handleDownload(tHeader,filterVal,downQuery,'教师信息',listTeacher)
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
                importTeacher(this.fileData3).then(function (response) {
                    self.$refs.upload3.clearFiles();
                    console.log(response)
                    
                    self.$message({
                        message: '上传成功',
                        type: 'success'
                    })
                    self.getTeacherList()
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
        }
    }
</script>
