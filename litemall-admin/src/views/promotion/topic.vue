<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.title" clearable class="filter-item" style="width: 200px;"
                      placeholder="请输入新闻标题"/>
            <!-- <el-input v-model="listQuery.subtitle" clearable class="filter-item" style="width: 200px;"
                      placeholder="请输入新闻子标题"/> -->
            <el-select v-model="listQuery.onHomepage" clearable class="filter-item" style="width:200px;" placeholder="首页是否展示">
                <el-option v-for="(value,index) in Home" :key="index" :label="value" :value="index"/>
            </el-select>
            <el-button v-permission="['GET /admin/topic/list']" class="filter-item" type="primary" icon="el-icon-search"
                       @click="handleFilter">查找
            </el-button>
            <el-button v-permission="['POST /admin/topic/create']" class="filter-item" type="primary"
                       icon="el-icon-edit" @click="handleCreate">添加
            </el-button>
            <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                       @click="handleDownload">导出
            </el-button>
        </div>

        <!-- 查询结果 -->
        <div style="height: calc(100% - 155px);overflow: hidden">
            <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                <el-table-column align="center" label="新闻标题" prop="title"/>

                <!-- <el-table-column align="center" label="新闻子标题" min-width="200" prop="subtitle"/> -->

                <el-table-column align="center" property="picUrl" label="新闻图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.picUrl" width="80">
                    </template>
                </el-table-column>

                <el-table-column align="center" label="新闻详情" prop="content">
                    <template slot-scope="scope">
                        <el-dialog :visible.sync="contentDialogVisible" title="新闻详情">
                            <div v-html="contentDetail"/>
                        </el-dialog>
                        <el-button type="primary" size="mini" @click="showContent(scope.row.content)">查看</el-button>
                    </template>
                </el-table-column>              

                <el-table-column align="center" label="阅读数量" prop="readCount"/>
                <el-table-column align="center" label="首页展示" prop="onHomepage">
                    <template slot-scope="scope">
                        <el-tag>{{Home[scope.row.onHomepage]}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="操作" min-width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button v-permission="['POST /admin/topic/update']" type="primary" size="mini"
                                   @click="handleUpdate(scope.row)">编辑
                        </el-button>
                        <el-button v-permission="['POST /admin/topic/delete']" type="danger" size="mini"
                                   @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>

        <el-tooltip placement="top" content="返回顶部">
            <back-to-top :visibility-height="100"/>
        </el-tooltip>

        <!-- 添加或修改对话框 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left"
                     label-width="100px" style="width: 400px; margin-left:50px;">
                <el-form-item label="新闻标题" prop="title">
                    <el-input v-model="dataForm.title"/>
                </el-form-item>
                <!-- <el-form-item label="新闻子标题" prop="subtitle">
                    <el-input v-model="dataForm.subtitle"/>
                </el-form-item> -->
                <el-form-item label="新闻图片" prop="picUrl">
                   <img v-if="dataForm.picUrl" :src="dataForm.picUrl" class="logo">
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
                <el-form-item style="width: 700px;" label="新闻内容">
                    <editor :init="editorInit" v-model="dataForm.content"/>
                </el-form-item>
                <el-form-item label="首页展示" prop="onHomepage">
                    <el-select v-model="dataForm.onHomepage" >
                        <el-option v-for="(value,index) in Home" :key="index" :label="value" :value="index"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="阅读量" prop="readCount">
                    <el-input v-model="dataForm.readCount"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
                <el-button v-else type="primary" @click="updateData">确定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<style>
.logo {
        width: 145px;
        height: 145px;
        display: block;
    }
    .el-dialog {
        width: 800px;
    }

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
</style>

<script>
    import {listTopic, createTopic, updateTopic, deleteTopic} from '@/api/topic'
    import {createStorage, uploadPath,uploadHeaderPath} from '@/api/storage'
    import BackToTop from '@/components/BackToTop'
    import Editor from '@tinymce/tinymce-vue'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import {getToken} from '@/utils/auth'
    import {uploadTopicIcon} from '@/api/fileUpload'


    export default {
        name: 'Topic',
        components: {BackToTop, Editor, Pagination},
        data() {
            return {
                //上传图片
                fileList:undefined,
                fileData:undefined,
                //上传logo
                fileData1:undefined,
                uploadlogoUrl:undefined,
                
                list: undefined,
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    title: undefined,
                    onHomepage:undefined,
                    //subtitle: undefined,
                    sort: 'add_time',
                    order: 'desc'
                },
                Home:['否','是'],
                dataForm: {
                    id: undefined,
                    titile: undefined,
                    //subtitle: undefined,
                    picUrl: undefined,
                    content: '',
                    price: undefined,
                    readCount: undefined,
                    
                },
                contentDetail: '',
                contentDialogVisible: false,
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '创建'
                },
                rules: {
                    title: [
                        {required: true, message: '新闻标题不能为空', trigger: 'blur'}
                    ],
                    
                    content: [
                        {required: true, message: '新闻内容不能为空', trigger: 'blur'}
                    ]
                },
                deleted:{
                    ids:undefined
                },
                downloadLoading: false,
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
        computed: {
            headers() {
                return {
                    'X-Litemall-Admin-Token': getToken()
                }
            }
        },
        created() {
            this.getList()
        },
        watch:{
            'listQuery.title':function(val,oldVal){
                if(!val){
                    this.getList()
                }
            },
            'listQuery.onHomepage':function(val,oldVal){
                if(!val){
                    this.getList()
                }
            }
        },
        methods: {
            //上传专题图片
            uploadFile1(file) {
                this.fileData1.append('files', file.file);
                //console.log(this.fileData.get("iconFile"))
            },
            //确定上传
            submitUpload1() {
                console.log(111)
                this.fileData1 = new FormData();
                this.$refs.upload1.submit();
                var self = this
                uploadTopicIcon(this.fileData1).then(function (response) {
                    self.$refs.upload1.clearFiles();
                    self.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                    self.dataForm.picUrl = response.data.data[0]//用于展示
                    self.uploadlogoUrl=response.data.data[0]//用于提交
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            getList() {
                this.listLoading = true
                listTopic(this.listQuery)
                .then(response => {
                    this.list = response.data.data.items
                     for (var i in this.list) {
                        if (this.list[i].picUrl.substr(0, 4) != 'http') {
                            this.list[i].picUrl = this.list[i].picUrl
                        }
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
            handleFilter() {
                this.listQuery.page = 1
                this.getList()
            },
            resetForm() {
                this.dataForm = {
                    id: undefined,
                    titile: undefined,
                    //subtitle: undefined,
                    picUrl: undefined,
                    content: '',
                    price: undefined,
                    readCount: undefined,
                    
                }
            },
            handleCreate() {
                this.resetForm()
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            uploadPicUrl: function (response) {
                this.dataForm.picUrl = response.data.url
            },
            createData() {
                 this.dataForm.picUrl = this.uploadlogoUrl
                this.$refs['dataForm'].validate(valid => {
                    if (valid) {
                        createTopic(this.dataForm)
                        .then(response => {
                            this.list.unshift(response.data.data)
                            this.dialogFormVisible = false
                            this.$notify.success({
                                title: '成功',
                                message: '创建新闻成功'
                            })
                            this.getList()
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
            showContent(content) {
                this.contentDetail = content
                this.contentDialogVisible = true
            },
            handleUpdate(row) {
                this.dataForm = Object.assign({}, row)
                this.dialogStatus = 'update'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            updateData() {
                this.dataForm.picUrl = this.uploadlogoUrl
                this.$refs['dataForm'].validate(valid => {
                    if (valid) {
                        updateTopic(this.dataForm)
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
                                message: '更新新闻成功'
                            })
                            this.getList()
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
                this.deleted.ids=row.id
                deleteTopic(this.deleted)
                .then(response => {
                    this.$notify.success({
                        title: '成功',
                        message: '删除新闻成功'
                    })
                    this.getList()
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
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = [
                        '新闻ID',
                        '新闻标题',
                        
                        '新闻内容',
                        '新闻图片',                       
                        '阅读量',
                        '首页展示'
                    ]
                    const filterVal = [
                        'id',
                        'title',
                        
                        'detailInfo',
                        'picUrl',
                       
                        'readCount',
                        'onHomepage'
                    ]
                    excel.export_json_to_excel2(tHeader, this.list, filterVal, '新闻信息')
                    this.downloadLoading = false
                })
            }
        }
    }
</script>
