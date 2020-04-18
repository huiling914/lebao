<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-input v-model="listQuery.name" class="filter-item" style="width:200px;" placeholder="请输入学校名称"/>
			<el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
            <el-button  class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
		</div>
		<!--查询结果-->
		<div style="height: calc(100% - 155px);overflow: hidden">
			<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                <el-table-column align="center" label="学校ID" prop="id"/>
                <el-table-column align="center" label="学校名称" prop="name"/>
                <el-table-column align="center" label="学校地址" prop="address"/>
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
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left"
                     label-width="100px" style="width: 400px; margin-left:40px;">
                <el-form-item label="学校名称" prop="name">
                	<el-input v-model="dataForm.name" clearable/>
                </el-form-item>
                <el-form-item label="区域" prop="area">
                    <div class="area">
                    <el-select v-model="dataForm.prov" placeholder="请选择省" @change="getCity" style="width:260px;">
                        <el-option v-for="(item,index) in areaList" :key="item.id" :label="item.name" :value="item.id"/>
                    </el-select>
                    <el-select v-model="dataForm.city" placeholder="请选择市" @change="getDist" style="width:260px;">
                        <el-option v-for="(item,index) in cityList" :key="item.id" :label="item.name" :value="item.id"/>
                    </el-select>
                    <el-select v-model="dataForm.dist" placeholder="请选择区/县" style="width:260px;">
                        <el-option v-for="(item,index) in distList" :key="item.id" :label="item.name" :value="item.id"/>
                    </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="学校地址" prop="address">
                	<el-input v-model="dataForm.address" clearable/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">

                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button :loading="addLoading" v-if="dialogStatus=='create'" type="primary" @click="createPubSchool">确定</el-button>
                <el-button :loading="addLoading" v-else type="primary" @click="updatePubSchool">确定</el-button>
            </div>
        </el-dialog>
	</div>
</template>
<script>
	import Pagination from '@/components/Pagination'
	import {listPubSchool,createPubSchool,updatePubSchool,readPubSchool,deletePubSchool} from '@/api/school'
	import area from '@/utils/area'
	export default{
		components:{Pagination},
		name:'pubSchool',
		data(){
			return{
				list:[],
				total:0,
				listLoading:false,
				addLoading:false,
				listQuery:{
					name:undefined,
					page:1,
					limit:20,
					sort:'update_time',
					order:'desc'
				},
				dialogFormVisible:false,
				
			    dialogStatus: '',
			    textMap: {
			    	update: '编辑',
                    create: '创建'
                },
                dataForm:{
                	name:undefined,
                	address:undefined,
                	longitude:undefined,
                	latitude:undefined,
                	prov:undefined,
                	city:undefined,
                	dist:undefined,
                },
                deleted:{
                	ids:undefined
                },
                areaList:[],
                cityList:[],
                distList:[],
                rules:{
                	name:[  
                	  {required:true,message:'学校名称不能为空',trigger:'blur'}
                	],
                	prov:[
                	  {required:true,message:'省不能为空',trigger:'blur'}
                	],
                	city:[
                	  {required:true,message:'市不能为空',trigger:'blur'}
                	],
                	dist:[
                	  {required:true,message:'区/县不能为空',trigger:'blur'}
                	],
                	address:[
                	  {required:true,message:'地址不能为空',trigger:'blur'}
                	],

                }
			}
		},
		created(){
			this.areaList=area
			this.getList()
		},
		methods:{
			getList(){
				this.listLoading=true
				listPubSchool(this.listQuery).then((res)=>{
					if(res.data.errno==0){
						this.list=res.data.data.items
					    this.total=res.data.data.total
					    this.listLoading=false
					}else{
						this.list=[]
						this.total=0
						this.listLoading=false
					}
					
				}).catch((err)=>{
					this.list=[]
					this.total=0
					this.listLoading=false
				})
			},
			handleFilter(){
				this.getList()
			},
			resetForm(){
				this.dataForm={
					name:undefined,
                	address:undefined,
                	longitude:undefined,
                	latitude:undefined,
                	prov:undefined,
                	city:undefined,
                	dist:undefined,
				}
				this.cityList=[]
				this.distList=[]

			},
			getCity(){
                this.dataForm.city=undefined
                this.dataForm.dist=undefined
                for(var i in this.areaList){
                    if(this.areaList[i].id==this.dataForm.prov){
                        this.cityList=this.areaList[i].son
                        break
                    }
                }
            },
            getCity1(){
                //this.dataForm.city=undefined
                //this.dataForm.dist=undefined
                for(var i in this.areaList){
                    if(this.areaList[i].id==this.dataForm.prov){
                        this.cityList=this.areaList[i].son
                        break
                    }
                }
            },
            getDist1(){
                //this.dataForm.dist=undefined
                for(var i in this.cityList){
                    if(this.cityList[i].id==this.dataForm.city){
                        this.distList=this.cityList[i].son
                        break
                    }
                }
            },
            getDist(){
                this.dataForm.dist=undefined
                for(var i in this.cityList){
                    if(this.cityList[i].id==this.dataForm.city){
                        this.distList=this.cityList[i].son
                        break
                    }
                }
            },
            handleCreate(){
            	this.dialogFormVisible=true
            	this.dialogStatus="create"
            	this.resetForm()
            	this.addLoading=false
				this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            createPubSchool(){
            	this.$refs.dataForm.validate(valid=>{
					if(valid){
						this.addLoading=true
						createPubSchool(this.dataForm).then((res)=>{
							console.log(res)
							if(res.data.errno==0){
								this.getList()
								this.dialogFormVisible=false
								this.addLoading=false
								this.$notify.success({
									title:'成功',
									message:'添加成功'
								})
							}else{
								//console.log('test')
								this.addLoading=false
								this.$notify.error({
									title:'失败',
									message:res.data.errmsg
								})
							}
						}).catch((err)=>{
							this.addLoading=false
							this.$notify.error({
								title:'失败',
								message:err.data.errmsg
							})
						})
					}else{
						return false
					}
				})
            },
            handleUpdate(row){
            	this.dialogStatus = 'update'
                this.dialogFormVisible = true
                readPubSchool(row.id).then((res)=>{
                	this.dataForm=res.data.data
                	this.getCity1()
                    this.getDist1()
                    

                })
                

                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            updatePubSchool(){
            	this.$refs.dataForm.validate(valid=>{
					if(valid){
						this.addLoading=true
						updatePubSchool(this.dataForm).then((res)=>{
							if(res.data.errno==0){
								this.getList()
								this.dialogFormVisible=false
								this.addLoading=false
								this.$notify.success({
									title:'成功',
									message:'修改成功'
								})
							}else{
								this.addLoading=false
								this.$notify.error({
									title:'失败',
									message:res.data.errmsg
								})
							}
						}).catch((err)=>{
							this.addLoading=false
							this.$notify.error({
								title:'失败',
								message:err.data.errmsg
							})
						})
					}else{
						return false
					}
				})
            },
            handleDelete(row){
            	this.$confirm('确定删除该公立学校吗','提示',{
					confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
				}).then(()=>{
					this.deleted.ids=row.id
					deletePubSchool(this.deleted).then((res)=>{
						this.getList()
						this.$notify.success({
				 			title: '成功',
                            message: '删除成功'
                         })
					}).catch((err)=>{
						this.$notify.error({
                            title: '失败',
                            message: '删除失败'
                        })
					})
				})
            }
		}
	}
</script>
<style>
.area{
        display: -webkit-flex; /* Safari */
        display:flex;
        flex-direction: row;

    }
</style>