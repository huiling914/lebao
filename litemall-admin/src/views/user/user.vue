<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 160px;"
                      placeholder="请输入用户名"/>
            <el-input v-model="listQuery.mobile" clearable class="filter-item" style="width: 160px;"
                      placeholder="请输入手机号"/>
            <el-date-picker
                  class="filter-item"
                  value-format="yyyyMMdd"
                  v-model="listQuery.beginTime"
                  type="date"
                  placeholder="选择开始日期"
                  style="width: 160px;"
                  >
            </el-date-picker>
             <el-date-picker
                  class="filter-item"
                  value-format="yyyyMMdd"
                  v-model="listQuery.endTime"
                  type="date"
                  placeholder="选择结束日期"
                  style="width: 160px;"
                 >
            </el-date-picker>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
            <!-- <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>-->
            <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                       @click="handleDownload">导出
            </el-button>
        </div>

        <!-- 查询结果 -->
        <div style="height: calc(100% - 155px);overflow: hidden">
            <el-table v-loading="listLoading" :data="list" row-key="id" :expand-row-keys="expands" @expand-change="rowClick" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <div style="height: 200px">
                            <el-table v-loading="scope.row.listLoading" :data="scope.row.stuList" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row height="100%">
                                <el-table-column align="center" label="学生ID" prop="id" />
                                <el-table-column align="center" label="学生姓名" prop="name" />
                                <el-table-column align="center" label="关系" prop="relation" >
                                    <template slot-scope="scope">
                                        <el-tag>{{ relationDic[scope.row.relation] }}</el-tag>
                                     </template>
                                </el-table-column>
                                <el-table-column align="center" label="性别" prop="gender">
                                    <template slot-scope="scope">
                                         <el-tag>{{ genderDic[scope.row.gender] }}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="年级" prop="grade" />
                                <el-table-column align="center" label="生日" prop="birthday" />
                                <el-table-column align="center" label="学校" prop="schoolName" />
                                <el-table-column align="center" label="兴趣爱好" prop="interest" />

                             </el-table>
                         </div>
                    </template>
                   

                </el-table-column>
                <el-table-column align="center" label="用户ID" prop="id" sortable/>

                <el-table-column align="center" label="用户名" prop="username"/>

                <el-table-column align="center" label="注册时间" width="150" prop="addTime"/>

                <el-table-column align="center" label="余额" prop="balance"/>

                <el-table-column align="center" label="宝宝币" prop="vouchers"/>

                <el-table-column align="center" label="用户等级" prop="userLevel">
                    <template slot-scope="scope">
                        <el-tag>{{ levelDic[scope.row.userLevel] }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="状态" prop="status">
                    <template slot-scope="scope">
                        <el-tag>{{ statusDic[scope.row.status] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="备注" prop="remark"/>
                <el-table-column align="center" label="操作"  class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                        <!--<el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>

        <!-- 添加或修改对话框 -->
        <el-dialog :title="'编辑'" :close-on-click-modal="false" :visible.sync="dialogFormVisible" >
            <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left"
                     label-width="100px" style="width: 400px; margin-left:50px;">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="dataForm.username"/>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile">
                    <el-input v-model="dataForm.mobile"/>
                </el-form-item>
                <el-form-item label="用户等级" prop="userLevel">
                    <el-select v-model="dataForm.userLevel">
                        <el-option :value="0" label="普通用户"/>
                        <el-option :value="1" label="VIP用户"/>
                        <el-option :value="2" label="高级VIP用户"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="dataForm.status">
                        <el-option :value="0" label="可用"/>
                        <el-option :value="1" label="禁用"/>
                        <el-option :value="2" label="注销"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button @click="updateData">确定</el-button>
            </div>
        </el-dialog>

        <!-- 添加或修改对话框 -->
        <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
           <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
             <el-form-item label="用户名" prop="username">
               <el-input v-model="dataForm.username"/>
             </el-form-item>
             <el-form-item label="手机号码" prop="mobile">
               <el-input v-model="dataForm.mobile"/>
             </el-form-item>
             <el-form-item label="密码" prop="password">
               <el-input v-model="dataForm.password" type="password" auto-complete="off"/>
             </el-form-item>
             <el-form-item label="性别" prop="gender">
               <el-select v-model="dataForm.gender">
                 <el-option :value="0" label="未知"/>
                 <el-option :value="1" label="男"/>
                 <el-option :value="2" label="女"/>
               </el-select>
             </el-form-item>
             <el-form-item label="生日" prop="birthday">
               <el-date-picker v-model="dataForm.birthday" type="date" value-format="yyyy-MM-dd"/>
             </el-form-item>
             <el-form-item label="用户等级" prop="userLevel">
               <el-select v-model="dataForm.userLevel">
                 <el-option :value="0" label="普通用户"/>
                 <el-option :value="1" label="VIP用户"/>
                 <el-option :value="2" label="高级VIP用户"/>
               </el-select>
             </el-form-item>
             <el-form-item label="状态" prop="status">
               <el-select v-model="dataForm.status">
                 <el-option :value="0" label="可用"/>
                 <el-option :value="1" label="禁用"/>
                 <el-option :value="2" label="注销"/>
               </el-select>
             </el-form-item>
           </el-form>
           <div slot="footer" class="dialog-footer">
             <el-button @click="dialogFormVisible = false">取消</el-button>
             <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
             <el-button v-else type="primary" @click="updateData">确定</el-button>
           </div>
         </el-dialog>-->
    </div>
</template>

<script>
    import {fetchList, createUser, updateUser,getfavorStu} from '@/api/user'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import {handleDownload} from '@/utils/commen'
    export default {
        name: 'User',
        components: {Pagination},
        data() {
            return {
                list: null,
                total: 0,
                stuQuerey:{
                    userId:undefined,
                    page: 1,    // 页数
                    limit: 10,    // 每页容量
                    sort: "update_time",    // 排序字段
                    order: "desc",    // 排序规则
                },
                expands:[],
                stuList:[],
                listLoading: true,
                listLoading1:true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    beginTime:undefined,
                    endTime:undefined,
                    username: undefined,
                    mobile: undefined,
                    sort: 'add_time',
                    order: 'desc'
                },

                dataForm: {
                    id: undefined,
                    username: '',
                    userLevel: 0,
                    status: 0
                },
                dataForm1: {},
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '创建'
                },
                rules: {
                    username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
                    mobile: [{required: true, message: '手机号码不能为空', trigger: 'blur'}],
                    password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
                },
                downloadLoading: false,
                //genderDic: ['未知', '男', '女'],
                levelDic: ['普通用户', 'VIP用户', '高级VIP用户'],
                statusDic: ['可用', '禁用', '注销'],
                relationDic:['父亲','母亲','爷爷','奶奶','外公','外婆','姐姐','哥哥'],
                genderDic:['女','男'],
                oldmobile: undefined,
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.listLoading = true
                fetchList(this.listQuery).then(response => {
                    console.log(response)
                    this.list = response.data.data.items
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
                this.dataForm = {}
            },
            handleCreate() {
                this.resetForm()
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            createData() {
                this.$refs['dataForm'].validate((valid) => {
                    this.dataForm1 = this.dataForm
                    this.dataForm1.mobile = undefined
                    if (valid) {
                        createUser(this.dataForm1).then(response => {
                            this.list.unshift(response.data.data)
                            this.dialogFormVisible = false
                            this.$notify.success({
                                title: '成功',
                                message: '添加用户成功'
                            })
                        }).catch(response => {
                            this.$notify.error({
                                title: '失败',
                                message: response.data.errmsg
                            })
                        })
                    }
                })
            },
            handleUpdate(row) {
                //this.dataForm = Object.assign({}, row)
                this.dialogStatus = 'update'
                this.dataForm.id = row.id
                this.dataForm.username = row.username
                this.dataForm.status = row.status
                this.dataForm.mobile = row.mobile
                this.oldmobile = row.mobile
                this.dataForm.userLevel = row.userLevel
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            updateData() {
                this.$refs['dataForm'].validate((valid) => {

                    if (valid) {
                        if (this.dataForm.mobile == this.oldmobile) {
                            this.dataForm1.id = this.dataForm.id
                            this.dataForm1.username = this.dataForm.username
                            this.dataForm1.status = this.dataForm.status
                            this.dataForm1.userLevel = this.dataForm.userLevel
                            updateUser(this.dataForm1).then(() => {

                                this.dialogFormVisible = false
                                this.$notify.success({
                                    title: '成功',
                                    message: '更新成功'
                                })
                                this.getList()
                            }).catch(response => {
                                this.$notify.error({
                                    title: '失败',
                                    message: response.data.errmsg
                                })
                            })
                        } else {
                            updateUser(this.dataForm).then(() => {
                                this.dialogFormVisible = false
                                this.$notify.success({
                                    title: '成功',
                                    message: '更新成功'
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
                })
            },
            handleDelete(row) {
                this.$notify.error({
                    title: '警告',
                    message: '用户删除操作不支持！'
                })
            },
            handleDownload() {
                this.downloadLoading = true
                const tHeader = ['用户ID', '用户名', '手机号码', '余额', '宝宝币', '用户等级', '状态']
                const filterVal = ['id', 'username', 'mobile', 'balance', 'vouchers', 'userLevel', 'status']
                var downQuery=this.listQuery
                downQuery.limit=-1
                handleDownload(tHeader,filterVal,downQuery,'用户信息',fetchList)
                this.downloadLoading=false
            },
            //点击展开行
            rowClick(row){
                var stuQuerey={userId:row.id,page:1,limit:20,sort:"update_time",order:"desc"}
                getfavorStu(stuQuerey).then((response)=>{
                    // this.stuList = response.data.data.items
                    // console.log(response.data.data.items)
                    //  console.log(this.stuList)
                    if(this.expands.indexOf(row.id)<0){
                        for(var i=0;i<this.list.length;i++){
                            if(this.list[i].id==row.id){
                                this.list[i].listLoading=true
                                this.list[i].stuList=response.data.data.items
                                this.list[i].listLoading=false
                                break
                            }
                            
                        }
                        this.expands.push(row.id)
                    }else{
                         for(var i=0;i<this.expands.length;i++){
                            if(this.expands[i]==row.id){
                                this.expands.splice(i,1)
                            }
                        }
                    }
                }).catch((error)=>{
                    console.log(error)
                })
                
                
                //console.log(row.id)
                
                


            }
        },
        watch:{
          'listQuery.username':function(val,oldVal){
            if(!val){
              this.getList()
            }
          },
          'listQuery.mobile':function(val,oldVal){
            if(!val){
              this.getList()
            }
          }
        }
    }
</script>
