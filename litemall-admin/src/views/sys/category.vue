<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入类目ID"/>
            <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;"
                      placeholder="请输入类目名称"/>
            <el-button v-permission="['GET /admin/category/list']" class="filter-item" type="primary"
                       icon="el-icon-search" @click="handleFilter">查找
            </el-button>
            <el-button v-permission="['POST /admin/category/create']" class="filter-item" type="primary"
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

                <el-table-column align="center" label="类目ID" prop="id"/>

                <el-table-column align="center" label="类目名称" prop="name"/>

                <el-table-column align="center" property="iconUrl" label="类目图标">
                    <template slot-scope="scope">
                        <img v-if="scope.row.iconUrl" :src="scope.row.iconUrl" width="40">
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="100" label="类目描述" prop="desc"/>

                <el-table-column
                    :filters="[{ text: '一级类目', value: 'L1' }, { text: '二级类目', value: 'L2' }]"
                    :filter-method="filterLevel"
                    align="center"
                    label="类目级别"
                    prop="level">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.level === 'L1' ? 'primary' : 'info' ">{{ scope.row.level === 'L1' ?
                            '一级类目' : '二级类目' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="父类目ID" prop="pid"/>

                <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button v-permission="['POST /admin/category/update']" type="primary" size="mini"
                                   @click="handleUpdate(scope.row)">编辑
                        </el-button>
                        <el-button v-permission="['POST /admin/category/delete']" type="danger" size="mini"
                                   @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>

        <!-- 添加或修改对话框 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left"
                     label-width="100px" style="width: 400px; margin-left:50px;">
                <el-form-item label="类目名称" prop="name">
                    <el-input v-model="dataForm.name"/>
                </el-form-item>
                <el-form-item label="级别" prop="level">
                    <el-select v-model="dataForm.level" @change="onLevelChange">
                        <el-option label="一级类目" value="L1"/>
                        <el-option label="二级类目" value="L2"/>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="dataForm.level === 'L2'" label="父类目" prop="pid">
                    <el-select v-model="dataForm.pid">
                        <el-option v-for="item in catL1" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="类目图标" prop="iconUrl">
                    <img v-if="dataForm.iconUrl" :src="dataForm.iconUrl" class="avatar">
                    <el-upload
                        class="upload-uploader"
                        ref="upload"
                        :headers="headers"
                        :limit="1"
                        :file-list="fileList"
                        action="111"
                        :http-request="uploadFile"
                        :auto-upload="false"
                        list-type="picture">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器
                        </el-button>
                    </el-upload>
                </el-form-item>
                <!--<el-form-item label="类目图片" prop="picUrl">
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
                </el-form-item>-->
                <el-form-item label="类目简介" prop="desc">
                    <el-input v-model="dataForm.desc"/>
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
    import {listCategory, listCatL1, createCategory, updateCategory, deleteCategory} from '@/api/category'
    import {uploadPath, uploadHeaderPath} from '@/api/storage'
    import {getToken} from '@/utils/auth'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import {uploadCategoryIcon} from '@/api/fileUpload'


    export default {
        name: 'Category',
        components: {Pagination},
        data() {
            return {
                fileData: undefined,
                list: undefined,
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    id: undefined,
                    name: undefined,
                    sort: 'add_time',
                    order: 'desc'
                },
                catL1: {},
                dataForm: {
                    id: undefined,
                    name: '',
                    level: 'L2',
                    pid: undefined,
                    desc: '',
                    iconUrl: undefined,
                },
                uploadicon: undefined,
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '创建'
                },
                rules: {
                    name: [{required: true, message: '类目名不能为空', trigger: 'blur'}]
                },
                downloadLoading: false,
                delete: []
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
            this.getCatL1()
        },
        methods: {
            //上传类目图标
            uploadFile(file) {
                this.fileData.append('iconFile', file.file);
                console.log(this.fileData.get("iconFile"))
            },
//确定上传
            submitUpload() {
                this.fileData = new FormData();
                this.$refs.upload.submit();
                var self = this
                uploadCategoryIcon(this.fileData).then(function (response) {
                    self.$refs.upload.clearFiles();
                    self.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                    self.dataForm.iconUrl = uploadHeaderPath + response.data.data[0]
                    self.uploadicon = response.data.data[0]
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            getList() {
                this.listLoading = true
                listCategory(this.listQuery)
                .then(response => {
                    console.log(response)
                    this.list = response.data.data.items
                    for (var i in this.list) {
                        if (this.list[i].iconUrl.substr(0, 4) != 'http') {
                            this.list[i].iconUrl = uploadHeaderPath + this.list[i].iconUrl
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
            getCatL1() {
                listCatL1().then(response => {
                    this.catL1 = response.data.data
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getList()
            },
            resetForm() {
                this.dataForm = {
                    id: undefined,
                    name: '',
                    level: 'L2',
                    pid: undefined,
                    desc: '',
                    iconUrl: undefined,
                }
            },
            filterLevel: function (value, row) {
                return row.level === value
            },
            onLevelChange: function (value) {
                if (value === 'L1') {
                    this.pid = undefined
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
            /*
             uploadIconUrl: function(response) {
               this.dataForm.iconUrl = response.data.url
             },
             uploadPicUrl: function(response) {
               this.dataForm.picUrl = response.data.url
             },
             */
            createData() {
                console.log(this.dataForm)
                this.dataForm.iconUrl = this.uploadicon
                this.$refs['dataForm'].validate(valid => {
                    if (valid) {
                        createCategory(this.dataForm)
                        .then(response => {
                            this.list.unshift(response.data.data)
                            // 更新L1目录
                            this.getCatL1()
                            this.dialogFormVisible = false
                            this.$notify.success({
                                title: '成功',
                                message: '创建成功'
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
            handleUpdate(row) {
                this.dataForm = Object.assign({}, row)
                this.dialogStatus = 'update'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            updateData() {
                this.dataForm.iconUrl = this.uploadicon
                this.$refs['dataForm'].validate(valid => {
                    if (valid) {
                        updateCategory(this.dataForm)
                        .then(() => {
                            for (const v of this.list) {
                                if (v.id === this.dataForm.id) {
                                    const index = this.list.indexOf(v)
                                    this.list.splice(index, 1, this.dataForm)
                                    break
                                }
                            }
                            // 更新L1目录
                            this.getCatL1()
                            this.dialogFormVisible = false
                            this.$notify.success({
                                title: '成功',
                                message: '更新成功'
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
                this.delete.push(row.id)
                deleteCategory(this.delete)
                .then(response => {
                    // 更新L1目录
                    this.getCatL1()
                    this.$notify.success({
                        title: '成功',
                        message: '删除成功'
                    })
                    const index = this.list.indexOf(row)
                    this.list.splice(index, 1)
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
                        '类目ID',
                        '名称',
                        '关键字',
                        '级别',
                        '父类目ID',
                        '类目图标',
                        '类目图片',
                        '简介'
                    ]
                    const filterVal = [
                        'id',
                        'name',
                        'keywords',
                        'level',
                        'pid',
                        'iconUrl',
                        'picUrl',
                        'desc'
                    ]
                    excel.export_json_to_excel2(
                        tHeader,
                        this.list,
                        filterVal,
                        '商品类目信息'
                    )
                    this.downloadLoading = false
                })
            }
        }
    }
</script>
