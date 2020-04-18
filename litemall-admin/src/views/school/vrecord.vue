<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-input v-model="listQuery.user" clearable class="filter-item" style="width:160px;" placeholder="请输入用户ID"/>
			<el-input v-model="listQuery.schName" clearable class="filter-item" style="width:160px;" placeholder="请输入学校名称"/>
			<el-select v-model="listQuery.status" clearable class="filter-item" style="width:160px;" placeholder="请选择打卡状态">
				<el-option  v-for="(value,index) in status" :key="index" :label="value" :value="index"/>
			</el-select>
			<el-date-picker style="width:160px;" v-model="listQuery.beginTime" class="filter-item" clearable type="date" value-format="yyyyMMdd" align="right" placeholder="起始日期"/><span class="filter-item">&nbsp;至</span>
            <el-date-picker style="width:160px;" v-model="listQuery.endTime" class="filter-item" clearable type="date" value-format="yyyyMMdd" align="right" placeholder="结束日期"/>
            <el-button  class="filter-item" type="primary" icon="el-icon-search"
                       @click="handleFilter">查找
            </el-button>
            <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
		</div>
		<!--查询结果-->
		<div style="height: calc(100% - 155px);overflow: hidden">
            <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row height="100%">
            	<el-table-column align="center" label="用户ID" prop="userId"/>
            	<el-table-column align="center" label="学校名称" prop="schoolName"/>
            	<el-table-column align="center" label="打卡时间" prop="clockTime"/>
            	<el-table-column align="center" label="打卡状态" prop="status">
            		<template slot-scope="scope">
            			<el-tag>{{ status[scope.row.status ]}}</el-tag>
            		</template>
            	</el-table-column>
            	
            	<el-table-column align="center" label="宝宝币" prop="integral" />
            	<el-table-column align="center" label="备注" prop="remark"/>
            </el-table>
        </div>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>
	</div>
</template>

<script>
    import { listVRecord } from '@/api/voluntary'
    import Pagination from '@/components/Pagination'
    import {handleDownload} from '@/utils/commen'
	export default{
		components:{Pagination},
		name:'vrecord',
		data(){
			return{
				list:undefined,
				total:0,
				listLoading:false,
				downloadLoading:false,
				listQuery:{
					user:undefined,
					schName:undefined,
					status:undefined,
					beginTime:undefined,
					endTime:undefined,
					page:1,
				    limit:20,

				},
				
				status:['已获赠宝宝币','未获赠宝宝币']
			}
		},
		methods:{
			getList(){
				this.listLoading=true
				listVRecord(this.listQuery).then((res)=>{
					this.list=res.data.data.items
					this.total=res.data.data.total
					this.listLoading=false
				}).catch((err)=>{
					this.list=[]
					this.total=0
					this.listLoading=false
				})
			},
			handleFilter(){
				this.listQuery.page=1
				this.getList()
			},
			handleDownload() {
                this.downloadLoading = true
                const tHeader = [
                        '用户ID',
                        '学校名称',
                        '打卡时间',
                        '打卡状态',
                        '宝宝币'

                    ]
                const filterVal = ['userId', 'schoolName','clockTime', 'status', 'integral']
                var downQuery=this.listQuery
                downQuery.limit=-1
                handleDownload(tHeader,filterVal,downQuery,'打卡记录',listVRecord)
                this.downloadLoading=false
            }
		},
		created(){
			this.getList()

		},
		watch:{
			'listQuery.user':function(val,oldVal){
				if(!val){
					this.getList()
				}
			},
			'listQuery.schName':function(val,oldVal){
				if(!val){
					this.getList()
				}
			},
			'listQuery.status':function(val,oldVal){
				if(!val){
					this.getList()
				}
			},
			'listQuery.beginTime':function(val,oldVal){
				if(!val){
					this.getList()
				}
			},
			'listQuery.endTime':function(val,oldVal){
				if(!val){
					this.getList()
				}
			}
		}
	}
</script>
