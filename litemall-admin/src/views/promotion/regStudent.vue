<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.examName" clearable class="filter-item" style="width:200px;" placeholder="请输入报名项目"/>
			<el-input v-model="listQuery.stuName" clearable class="filter-item" style="width:200px;" placeholder="请输入学员姓名"/>
			<el-select v-model="listQuery.payType" clearable class="filter-item" style="width:200px;" placeholder="请选择支付类型">
				<el-option v-for="(value,index) in payType" :key="index" :label="value" :value="index"/>
			</el-select>
			<el-select v-model="listQuery.status" clearable class="filter-item" style="width:200px;" placeholder="请选择支付状态">
				<el-option v-for="(value,index) in payStatus" :key="index" :label="value" :value="index"/>
			</el-select>
			<el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">查找</el-button>
			
            <!-- <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button> -->		
		</div>
		<!--查询结果-->
		<div style="height: calc(100% - 155px);overflow: hidden">
			<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                <el-table-column align="center" label="学员ID" prop="stuId"/>
                <el-table-column align="center" label="学员姓名" prop="stuName" />
                <el-table-column align="center" label="所属学校" prop="stuSchoolName"/>
                <el-table-column align="center" label="报名项目" prop="examName"/>
                <el-table-column align="center" label="报名金额" prop="payPrice"/>
                <el-table-column align="center" label="实付金额" prop="actualPrice"/>
                <el-table-column align="center" label="支付类型" prop="payType">
                	<template slot-scope="scope">
                		<el-tag>{{payType[scope.row.payType]}}</el-tag>
                	</template>
                </el-table-column>
                <el-table-column align="center" label="支付状态" prop="status">
                	<template slot-scope="scope">
                		<el-tag>{{payStatus[scope.row.status]}}</el-tag>
                	</template>
                </el-table-column>
                <el-table-column align="center" label="报名时间" prop="addTime"/>
                <el-table-column align="center" label="缴费时间" prop="payTime"/>
                <el-table-column align="center" label="报名用户" prop="userName"/>
                
            </el-table>
        </div>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
	</div>

</template>
<script>
	import Pagination from '@/components/Pagination'
	import {listRegStu} from '@/api/question'
	export default{
		name:'RegStudent',
		components:{Pagination},
		data(){
			return{
				total:0,
				listLoading:false,
				downloadLoading:false,
				list:[],
				listQuery:{
					examId:undefined,
					examName:undefined,
					stuName:undefined,
					payType:undefined,
					status:undefined,
					page:1,
					limit:20,
					sort:'update_time',
					order:'desc'


				},
				payType:['未指定','余额','微信小程序'],
				payStatus:['待支付','已支付']
			}
		},
		watch:{
            'listQuery.examName':function(val,oldVal){
                if(!val){
                    this.getList()
                }
            },
            'listQuery.stuName':function(val,oldVal){
                if(!val){
                    this.getList()
                }
            },
            'listQuery.payType':function(val,oldVal){
                if(!val){
                    this.getList()
                }
            },
            'listQuery.status':function(val,oldVal){
                if(!val){
                    this.getList()
                }
            }
        },
		methods:{
			getList(){
				this.listLoading=true
				listRegStu(this.listQuery).then((res)=>{
					this.listLoading=false
					this.list=res.data.data.items
					this.total=res.data.data.total
				}).catch((err)=>{
					this.listLoading=false
					this.list=[]
					this.total=0
				})
			},
			handleFilter(){
				this.listQuery.page=1
				this.getList()
			},
			handleDownload(){
				this.downloadLoading = true
				import('@/vendor/Export2Excel').then(excel => {
					const tHeader = [
					  '学员ID',
                      '学员姓名',
                      '所属学校',
                      '报名项目',
                      '报名金额',
                      '实付金额',
                      '支付类型',
                      '支付状态',
                      '报名时间',
                      '缴费时间',
                      '报名用户'

                    ]
                    const filterVal = [
                      'stuId',
                      'stuName',
                      'stuSchoolName',
                      'examName',
                      'payPrice',
                      'actualPrice',
                      'payType',
                      'status',
                      'addTime',
                      'payTime',
                      'userName'
                    ]
                    excel.export_json_to_excel2(tHeader, this.list, filterVal, '报名记录')
                    this.downloadLoading = false
                  })
			}
		},
		created(){
			this.listQuery.examId=this.$route.params.examId
			this.getList()
		}
	}

		
	
</script>
<style>
	
</style>