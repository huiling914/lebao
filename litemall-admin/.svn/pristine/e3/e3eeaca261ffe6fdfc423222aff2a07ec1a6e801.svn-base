<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.goodsSn" clearable class="filter-item" style="width: 200px;"
                      placeholder="请输入商品编号"/>
            <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;"
                      placeholder="请输入商品名称"/>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
            <!--<el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>-->
            <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                       @click="handleDownload">导出
            </el-button>
            <el-button class="filter-item"  type="danger" icon="el-icon-delete" @click="handleSelectionDelete">删除</el-button>
        </div>

        <!-- 查询结果 -->
        <div style="height: calc(100% - 155px);overflow: hidden">
            <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%" @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <!--
                      <el-table-column type="expand">
                        <template slot-scope="props">
                          <el-form label-position="left" class="table-expand">
                            <el-form-item label="宣传画廊">
                              <img v-for="pic in props.row.gallery" :key="pic" :src="pic" class="gallery">
                            </el-form-item>
                            <el-form-item label="商品介绍">
                              <span>{{ props.row.brief }}</span>
                            </el-form-item>
                            <!--<el-form-item label="商品单位">
                              <span>{{ props.row.unit }}</span>
                            </el-form-item>
                            <el-form-item label="关键字">
                              <span>{{ props.row.keywords }}</span>
                            </el-form-item>
                            <el-form-item label="类目ID">
                              <span>{{ props.row.categoryId }}</span>
                            </el-form-item>
                            <el-form-item label="品牌商ID">
                              <span>{{ props.row.brandId }}</span>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>-->

                <el-table-column align="center" label="商品编号" prop="goodsSn"/>

                <el-table-column align="center" min-width="100" label="商品名称" prop="name"/>

                <el-table-column align="center" min-width="100" label="所属商家" prop="brandName"/>

                <!--<el-table-column align="center" min-width="100" label="商品简介" prop="brief"/>-->


                <el-table-column align="center" label="宣传图片">
                    <template slot-scope="scope">
                        <img v-for="pic in scope.row.pictures" :key="pic.picId" :src="pic.picUrl" width="40">
                    </template>
                </el-table-column>

                <el-table-column align="center" label="商品价格" prop="counterPrice"/>


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

        <el-tooltip placement="top" content="返回顶部">
            <back-to-top :visibility-height="100"/>
        </el-tooltip>

        <!-- 添加或修改对话框 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left"
                     label-width="100px" style="width: 700px; margin-left:50px;">
                <el-form-item v-if="dataForm.id" label="商品ID" prop="id">
                    <el-input :readonly="true" v-model="dataForm.id"/>
                </el-form-item>
                <el-form-item label="商品编号" prop="goodsSn">
                    <el-input v-model="dataForm.goodsSn"/>
                </el-form-item>
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="dataForm.name"/>
                </el-form-item>
                <el-form-item label="所属商家ID" prop="brandNId">
                    <el-input v-model="dataForm.brandId"/>
                </el-form-item>
                <el-form-item label="商品简介" prop="brief">
                    <el-input type="textarea" :rows="6"  v-model="dataForm.brief"/>
                </el-form-item>
                <el-form-item label="商品价格" prop="counterPrice">
                    <el-input v-model="dataForm.counterPrice"/>
                </el-form-item>
                <el-form-item label="logo图">
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
                <el-form-item label="宣传图片">
                    <ul class="ve">
                        <li v-for="(item,index) in dataForm.pictures" v-if="item.picUrl">
                            <div class="picDiv"><img v-if="item.picUrl" :key="item.picId" :src="item.picUrl"
                                                     class="pics">
                                <el-button class="delete" type="danger" icon="el-icon-delete" circle
                                           @click="deletePic(index,item.picId)"></el-button>
                            </div>
                        </li>
                    </ul>
                    <el-upload
                        class="upload-uploader"
                        ref="upload"
                        :headers="headers"
                        multiple
                        :limit="5"
                        :file-list="fileList"
                        action="111"
                        :http-request="uploadFile"
                        :auto-upload="false"
                        list-type="picture">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器
                        </el-button>
                    </el-upload>
                    <!-- <el-upload
                       :headers="headers"
                       :action="uploadPath"
                       :show-file-list="false"
                       :on-success="uploadPicUrl"
                       class="avatar-uploader"
                       accept=".jpg,.jpeg,.png,.gif">
                       <img v-if="dataForm.picUrl" :src="dataForm.picUrl" class="avatar">
                       <i v-else class="el-icon-plus avatar-uploader-icon"/>
                     </el-upload>-->
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
    .table-expand {
        font-size: 0;
    }

    .table-expand label {
        width: 100px;
        color: #99a9bf;
    }

    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
    }

    .gallery {
        width: 80px;
        height: 80px;
        margin-right: 10px;
    }

    .avatar {
        width: 80px;
        height: 80px;

        margin-right: 10px;
    }

    .picDiv {
        position: relative;
    }

     ul.ve{
        padding-left: 0px;
    }

    ul.ve li{
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

    .logo {
        width: 145px;
        height: 145px;
        display: block;
    }
</style>

<script>
    import {listGoods, deleteGoods, publishGoods, editGoods} from '@/api/goods'
    import {uploadHeaderPath} from '@/api/storage'
    import BackToTop from '@/components/BackToTop'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import {uploadGoodsDetailPic, uploadGoodsIcon} from '@/api/fileUpload'

    export default {
        name: 'GoodsList',
        components: {BackToTop, Pagination},
        data() {
            return {
                fileData1: undefined,
                uploadlogoUrl_good: undefined,
                fileData: undefined,
                isCreat: true,
                list: [],
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    goodsSn: undefined,
                    name: undefined,
                    sort: 'add_time',
                    order: 'desc'
                },
                rules: {},
                goodsDetail: '',
                detailDialogVisible: false,
                downloadLoading: false,
                dataForm: {
                    id: undefined,
                    goodsSn: undefined,
                    name: '',
                    brief: '',
                    brandId: '',
                    counterPrice: undefined,
                    pictures: [],
                    uploadList: [],
                    updateList: [],
                    deleteList: [],
                    picUrl: undefined
                },
                dialogStatus: '',

                dialogFormVisible: false,
                textMap: {
                    update: '编辑',
                    create: '创建'
                },
                deletelist: [],
                fileList: [],
                headers: null,
                selectionList: []
        }
        },
        created() {
            this.getList()
        },
        methods: {
            //上传多张图片
            uploadFile(file) {
                this.fileData.append('files', file.file)
                //console.log(this.fileData.get("fileList"))
            },
            //确定上传
            submitUpload() {
                this.fileData = new FormData();
                var self = this
                this.$refs.upload.submit();
                uploadGoodsDetailPic(this.fileData).then(function (response) {
                    self.$refs.upload.clearFiles();
                    for (var key in response.data.data) {
                        self.dataForm.uploadList.push({'id': null, 'url': response.data.data[key]})
                        self.dataForm.pictures.push({'id': null, 'picUrl': response.data.data[key]})
                    }
                    console.log(self.dataForm.pictures)
                    for (var i in self.dataForm.pictures) {
                        console.log(self.dataForm.pictures[1].picUrl)
                        if (self.dataForm.pictures[i].picUrl.substr(0, 4) != 'http') {
                            self.dataForm.pictures[i].picUrl =  self.dataForm.pictures[i].picUrl
                        }
                    }

                    self.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            //上传商品logo图片
            uploadFile1(file) {
                this.fileData1.append('files', file.file);
                console.log(this.fileData1.get("iconFile"))
            },
            //确定上传
            submitUpload1() {
                this.fileData1 = new FormData();
                this.$refs.upload1.submit();
                var self = this
                uploadGoodsIcon(this.fileData1).then(function (response) {
                    self.$refs.upload1.clearFiles();
                    self.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                    self.dataForm.picUrl =  response.data.data[0]
                    self.uploadlogoUrl_good = response.data.data[0]
                    console.log(self.goodDataForm.picUrl)
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            //删除图片
            deletePic(index, picId) {
                console.log(index)
                console.log(picId)
                this.dataForm.pictures.splice(index, 1)
                this.dataForm.deleteList.push(picId)
                /*branddelFile(picId).then(function(response) {
                 console.log(response)
                              self.$message({
                               message: '删除成功',
                               type: 'success'
                             });

                                 })
                                 .catch(function(error) {
                                     console.log(error);
                                 })*/
            },
            getList() {
                this.listLoading = true
                listGoods(this.listQuery).then(response => {
                    console.log(response)
                    this.list = response.data.data.items
                    //拼接图片url

                    // for (var i in this.list) {
                    //     if (this.list[i].picUrl) {
                    //         if (this.list[i].picUrl.substr(0, 4) != 'http') {
                    //             this.list[i].picUrl = uploadHeaderPath + this.list[i].picUrl
                    //         }
                    //     }

                    //     if (this.list[i].pictures) {
                    //         for (var j in this.list[i].pictures) {
                    //             if (this.list[i].pictures[j].picUrl.substr(0, 4) != 'http') {
                    //                 this.list[i].pictures[j].picUrl = uploadHeaderPath + this.list[i].pictures[j].picUrl
                    //                 console.log(this.list[i].pictures[j].picUrl)
                    //             }
                    //         }
                    //     }
                    // }
                    this.total = response.data.data.total
                    this.listLoading = false
                }).catch(() => {
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
                    name: '',
                    goodsSn: undefined,
                    brief: '',
                    brandId: '',
                    counterPrice: undefined,
                    pictures: [],
                    uploadList: [],
                    updateList: [],
                    deleteList: [],
                    picUrl: undefined

                }
            },
            /*
            handleCreate() {
                 this.isCreat=true
                 //this.$router.push({ path: '/goods/create' })
                 this.resetForm()
                  this.dialogStatus = 'create'
                 this.dialogFormVisible = true
                 this.$nextTick(() => {
                   this.$refs['dataForm'].clearValidate()
                 })
               },
           createData() {
                 console.log(this.dataForm)
                 this.$refs['dataForm'].validate(valid => {
                   if (valid) {
                     publishGoods(this.dataForm)
                       .then(response => {
                         console.log(2222)
                         this.list.unshift(response.data.data)
                         this.dialogFormVisible = false
                         this.$notify.success({
                           title: '成功',
                           message: '创建成功'
                         })
                         this.resetForm()
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
               */
            handleUpdate(row) {
                //this.resetForm()
                //this.$router.push({ path: '/goods/edit', query: { id: row.id }})
                this.dataForm = Object.assign({}, row)
                this.dataForm.deleteList = []
                this.dataForm.uploadList = []
                console.log(this.dataForm)
                this.dialogStatus = 'update'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            updateData() {
                this.dataForm.counterPrice = parseFloat(this.dataForm.counterPrice)
                this.dataForm.picUrl = this.uploadlogoUrl_good
                console.log(this.dataForm)
                this.$refs['dataForm'].validate(valid => {
                    if (valid) {
                        editGoods(this.dataForm)
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
            showDetail(detail) {
                this.goodsDetail = detail
                this.detailDialogVisible = true
            },
            handleDelete(row) {
                this.deletelist = [];
                this.deletelist.push(row.id)
                deleteGoods(this.deletelist).then(response => {
                    this.$notify.success({
                        title: '成功',
                        message: '删除成功'
                    })
                    const index = this.list.indexOf(row)
                    this.list.splice(index, 1)
                }).catch(response => {
                    this.$notify.error({
                        title: '失败',
                        message: response.data.errmsg
                    })
                })
            },
            handleDownload() {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['商品ID', '商品名称', '所属商家', '商品简介', '商品价格']
                    const filterVal = ['id', 'name', 'brandName', 'brief', 'counterPrice']
                    excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品信息')
                    this.downloadLoading = false
                })
            },
            //多选 
            handleSelectionChange: function (val) {
                this.selectionList = val;
            },
            //批量删除
            handleSelectionDelete: function () {
                this.deletelist = [];
                for(let i =0;i<this.selectionList.length;i++){
                    this.deletelist.push(this.selectionList[i].id)
                }
                 if(this.deletelist.length==0){
                    this.$notify.error({
                        title: '失败',
                        message: "请选择要删除的记录"
                    })
                }else{
                    deleteGoods(this.deletelist).then(response => {
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
                
            }
        },
        watch:{
          'listQuery.goodsSn':function(val,oldVal){
            if(!val){
              this.getList()
            }
          },
          'listQuery.name':function(val,oldVal){
            if(!val){
              this.getList()
            }
          }
        }
    }
</script>
