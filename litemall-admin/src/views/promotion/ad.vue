<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入广告标题"/>
      <el-input v-model="listQuery.content" clearable class="filter-item" style="width: 200px;" placeholder="请输入广告内容"/>
      <el-button v-permission="['GET /admin/ad/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/ad/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
      <el-button class="filter-item"  type="danger" icon="el-icon-delete" @click="handleSelectionDelete">删除</el-button>
    </div>

    <!-- 查询结果 -->
    <div style="height: calc(100% - 155px);overflow: hidden">
      <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row height="100%" @selection-change="handleSelectionChange">

      <el-table-column
                    type="selection"
                    width="55">
      </el-table-column>

      <el-table-column align="center" label="广告ID" prop="id" sortable/>

      <el-table-column align="center" label="广告标题" prop="name"/>

      <el-table-column align="center" label="广告内容" prop="content"/>

      <el-table-column align="center" label="广告图片" prop="url">
        <template slot-scope="scope">
          <img v-if="scope.row.url" :src="scope.row.url" width="80">
        </template>
      </el-table-column>

      <el-table-column align="center" :formatter="formatterColumn" label="广告位置" prop="position"/>

      <el-table-column align="center" label="活动链接" prop="link"/>

      <el-table-column align="center" label="是否启用" prop="enabled">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enabled ? 'success' : 'error' ">{{ scope.row.enabled ? '启用' : '不启用' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/ad/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/ad/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="25%" style="width: 75%; margin-left:50px;">
        <el-form-item label="广告标题" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>
        <el-form-item label="广告内容" prop="content">
          <el-input v-model="dataForm.content"/>
        </el-form-item>
        <el-form-item label="广告图片" prop="url">
                    <img v-if="dataForm.url" :src="dataForm.url" class="logo">
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
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">
                            上传到服务器
                        </el-button>
                        </el-upload>
        </el-form-item>
        <el-form-item label="广告位置" prop="position">
          <el-select v-model="dataForm.position" clearable placeholder="请选择">
            <el-option v-for="(item,index) in positions" :key="index" :label="item" :value="index"/>
            
          </el-select>
        </el-form-item>

        <el-form-item label="跳转类型"  prop="linkType">
         <el-select v-model="dataForm.linkType" clearable placeholder="请选择" @change="getParam" >
            <el-option v-for="(item,index) in linkTypes" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="所属类目"  prop="category">
         <el-select v-model="dataForm.category" clearable placeholder="请选择" @change="getParam">
             <el-option v-for="category in listCategory" :key="category.id" :label="category.name" :value="category.id"/>
          </el-select>
        </el-form-item> -->
        <el-form-item label="具体位置"  prop="param">
        <el-select v-model="dataForm.param" clearable placeholder="请选择">
             <el-option v-if="dataForm.linkType!=4" v-for="param in listParam" :key="param.id" :label="param.name" :value="param.id"/>
             <el-option v-if="dataForm.linkType==4" v-for="param in listParam" :key="param.id" :label="param.title" :value="param.id"/>
        </el-select>
        </el-form-item>
        <!-- <el-form-item label="活动链接" prop="linkId">
          <el-select v-model="dataForm.linkId" clearable placeholder="请选择">
             <el-option v-for="link in listLink" :key="link.id" :label="link.name" :value="link.id"/>
          </el-select>
        </el-form-item> -->
          
        <el-form-item label="是否启用" prop="enabled">
          <el-select v-model="dataForm.enabled" placeholder="请选择">
            <el-option :value="1" label="启用"/>
            <el-option :value="0" label="不启用"/>
          </el-select>
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
    .logo {
        width: 145px;
        height: 145px;
        display: block;
    }
</style>

<script>
import { listAd, createAd, updateAd, deleteAd,listLink } from '@/api/ad'
import {listBrand} from '@/api/brand'
import {listSchool,listTeacher,listClass,listExpert,listPayClass} from '@/api/school'
import {listTopic} from '@/api/topic'
import {listCategory} from '@/api/category'
import { uploadHeaderPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { uploadAdIcon} from '@/api/fileUpload'

const positionMap = {
        0: '首页上部',
        1: '学校列表',
        2: '商城列表',
        3: '我的',

    }



export default {
  name: 'Ad',
  components: { Pagination },
   filters: {
            positionFilter(position) {
              position=paeseInt(position)
              console.log(position)
                return positionMap[position]
            }
        },
  data() {
    return {
      provinceOption:undefined,
      cityOption:undefined,
      countyOption:undefined,
      changeFlag:false,
      fileList:undefined,
      fileData:undefined,
      list: undefined,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        content: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: undefined,
        content: undefined,
        linkId: undefined,
        position: 1,
        enabled: 1,
        type:undefined,
        category:undefined,
        param:undefined
      },
       uploadicon:undefined,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [
          { required: true, message: '广告标题不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '广告内容不能为空', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择广告类目', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择广告类别', trigger: 'blur' }
        ],
        param: [
          { required: true, message: '请选择广告类别', trigger: 'blur' }
        ],
      },
      downloadLoading: false,
      delete:{
        id:undefined
      },
      selectionList:[],
      listCategoryQuery:{
        type:undefined,
        limit:100
      },
      linkTypes:['学校详情','课程详情','老师详情','商家详情','新闻详情','视频课程','专家详情'],
      positions:['首页上部','学校列表','商城列表','我的','新闻列表','视频课程'],
      listCategory:[],
      listParamQuery:{
        
         limit:-1,
         
      },
      listParam:[],
      listLink:[],
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
    this.getListLink()
  },
  methods: {
    //状态改成汉字
            formatterColumn(row) {
                switch (row.position) {
                    case 0:
                        return '首页上部';
                        break;

                    case 1:
                        return '学校列表';
                        break;

                    case 2:
                        return '商城列表';
                        break;

                    case 3:
                        return '我的';
                        break;

                    default:
                        return '未知';
                }
            },
    //上传广告图片
uploadFile(file){
    this.fileData.append('files',file.file);
    //console.log(this.fileData.get("iconFile"))
},
//确定上传
submitUpload() {
        this.fileData= new FormData();
        this.$refs.upload.submit();
        var self=this
    uploadAdIcon(this.fileData).then(function(response) {
                self.$refs.upload.clearFiles();
                 self.$message({
                  message: '上传成功',
                  type: 'success'
                });
                 self.dataForm.url=response.data.data[0]
                 self.uploadicon=response.data.data[0]
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
      },
    getList() {
      this.listLoading = true
      listAd(this.listQuery)
        .then(response => {
          this.list = response.data.data.items
           // for (var i in this.list) {
           //              if (this.list[i].url.substr(0, 4) != 'http') {
           //                  this.list[i].url =  this.list[i].url
           //              }
           //          }
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
        name: undefined,
        content: undefined,
        linkId: undefined,
        position: undefined,
        enabled: 1,
        type:undefined,
        category:undefined,
        param:undefined
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
    uploadUrl: function(response) {
      this.dataForm.url = response.data.url
    },
    createData() {
      
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.dataForm.url=this.uploadicon
          createAd(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
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
      console.log(this.dataForm)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.getParam()
      // this.listCategoryQuery.type=this.dataForm.type
      // this.getListCategory()
      // if(this.listCategoryQuery.type==0){
      //           this.listParamQuery.types=this.dataForm.category
      //           this.getListParambrand()  
      //         }else if(this.listCategoryQuery.type==1){
      //           this.listParamQuery.types=this.dataForm.category
      //           this.getListParamschool() 
      //         }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.dataForm.url=this.uploadicon
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateAd(this.dataForm)
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
                message: '更新广告成功'
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
      this.delete.id=row.id
      console.log(this.delete)
      deleteAd(this.delete)
        .then(response => {
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
          '广告ID',
          '广告标题',
          '广告内容',
          '广告图片',
          '广告位置',
          '活动链接',
          '是否启用'
        ]
        const filterVal = [
          'id',
          'name',
          'content',
          'url',
          'postion',
          'link',
          'enabled'
        ]
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '广告信息')
        this.downloadLoading = false
      })
    },
    //多选 
            handleSelectionChange: function (val) {
                this.selectionList = val;
            },
            //批量删除
            handleSelectionDelete: function () {
                this.delete.id = '';
                for(let i =0;i<this.selectionList.length;i++){
                    this.delete.id=this.delete.id+this.selectionList[i].id+','
                }
                this.delete.id=this.delete.id.substring(0,this.delete.id.length-1)
                console.log(this.delete.id)
                if(this.delete.id==null){
                    this.$notify.error({
                        title: '失败',
                        message: "请选择要删除的记录"
                    })
                }else{
                    deleteAd(this.delete).then(response => {
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
            // getParam:function(value){
            //   console.log(value)
            //   this.listCategory=[]
            //   if(value.length!=0){
            //     this.listCategoryQuery.type=value
            //     this.getListCategory()
            //     this.dataForm.category=''
            //     this.dataForm.param=''
            //   }
              
            // },
            getListCategory:function(){
              listCategory(this.listCategoryQuery)
                .then(response => {
                    console.log(response)
                    this.listCategory = response.data.data.items
                     
                })
                .catch(() => {
                    
                })
            },
            getParam:function(){
              if(this.dataForm.linkType==0){
                this.getSchool()
              }else if(this.dataForm.linkType==1){
                this.getClass()
              }else if(this.dataForm.linkType==2){
                this.getTeacher()
              }else if(this.dataForm.linkType==3){
                this.getBrand()
              }else if(this.dataForm.linkType==4){
                this.getTopic()
              }else if(this.dataForm.linkType==5){
                this.getPayClass()
              }else if(this.dataForm.linkType==6){
                this.getExpert()
              }
              
            },
            //获取商家列表
            getBrand:function(){
              listBrand(this.listParamQuery)
                .then(response => {
                    console.log(response)
                    this.listParam = response.data.data.items
                })
                .catch(() => {
                    
                })
            },
             //获取学校列表
            getSchool:function(){
              listSchool(this.listParamQuery)
                .then(response => {
                    console.log(response)
                    this.listParam = response.data.data.items
                })
                .catch(() => {
                    
                })
            },
            //获取老师列表
            getTeacher(){
              listTeacher(this.listParamQuery)
                .then(response => {
                    console.log(response)
                    this.listParam = response.data.data.items
                })
                .catch(() => {
                    
                })
            },
            //获取课程列表
            getClass(){
              listClass(this.listParamQuery)
                .then(response => {
                    console.log(response)
                    this.listParam = response.data.data.items
                })
                .catch(() => {
                    
                })
            },
            //获取视频课程列表
            getPayClass(){
              listPayClass(this.listParamQuery)
                .then(response => {
                    console.log(response)
                    this.listParam = response.data.data.items
                })
                .catch(() => {
                    
                })
            },
            //获取专家列表
            getExpert(){
              listExpert(this.listParamQuery)
                .then(response => {
                    console.log(response)
                    this.listParam = response.data.data.items
                })
                .catch(() => {
                    
                })
            },
            //获取专家列表
            getTopic(){
              listTopic(this.listParamQuery)
                .then(response => {
                    console.log(response)
                    this.listParam = response.data.data.items
                })
                .catch(() => {
                    
                })
            },
            getListLink:function(){
              this.listLink=[]
              listLink().then(response => {
                    console.log(response)
                    this.listLink = response.data.data.items
                })
                .catch(() => {
                    this.listLink = []
                })
            },

handleChangeFlag:function(type) {// select回调，判断当前下拉框是否展示
  this.changeFlag = type;
  console.log(this.changeFlag)
}
  },
        watch: {
            'dataForm.type'(e) {
              console.log(this.changeFlag)
                if( this.changeFlag ){

                   //this.dataForm.category =''
                }
                if( e ){
                  console.log(e)
                    //this.handleGetCityList({ parentId: e.id })
                }
            }
        },
}
</script>
