<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-select v-model="listQuery.status" clearable class="filter-item" placeholder="请选择订单状态">
				<el-option v-for="(item,index) in orderStatus" :key="index" :label="item" :value="index"/>
			</el-select>
			<el-date-picker v-model="listQuery.beginTime" class="filter-item" clearable type="date" value-format="yyyyMMdd" align="right" placeholder="起始日期"/><span class="filter-item">&nbsp;至</span>
            <el-date-picker v-model="listQuery.endTime" class="filter-item" clearable type="date" value-format="yyyyMMdd" align="right" placeholder="结束日期"/>
            <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">查找</el-button>
            <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
		</div>
		<!--查询结果-->
		<div style="height: calc(100% - 155px);overflow: hidden">
			<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                <el-table-column align="center" label="ID" prop="id"/>
                <el-table-column align="center" label="学校名称" prop="orgName"/>
                <el-table-column align="center" label="课程名称" prop="courseName"/>
                <el-table-column align="center" label="订单类型" prop="orderType">
                	<template slot-scope="scope">
                		<el-tag>{{orderType[scope.row.orderType]}}</el-tag>
                	</template>
                </el-table-column>
                <el-table-column align="center" label="订单状态" prop="orderStatus">
                	<template slot-scope="scope">
                		<el-tag>{{orderStatus[scope.row.orderStatus]}}</el-tag>
                	</template>
                </el-table-column>
                <el-table-column align="center" label="是否拼单" prop="groupStatus">
                	<template slot-scope="scope">
                		<el-tag>{{groupStatus[scope.row.groupStatus]}}</el-tag>
                	</template>
                </el-table-column>
                <el-table-column align="center" label="下单时间" prop="addTime"/>
                <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleRead(scope.row)">详情</el-button>                       
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>
        <!--详情界面-->
        <el-dialog title="详情"   :visible.sync="dialogFormVisible" :close-on-click-modal="false" :top="'0'" >
			<el-form ref="dataForm"  :model="dataForm"  status-icon label-position="left"
                     label-width="15%" style="width: 95%; margin-left:20px; "  >               
                <el-form-item label="订单号" >
                	<span>{{dataForm.sn}}</span>
                </el-form-item>
                <el-form-item label="学校ID" v-if="dataForm.orgId">
                	<span>{{dataForm.orgId}}</span>
                </el-form-item>
                <el-form-item label="学校名称" v-if="dataForm.orgName">
                	<span>{{dataForm.orgName}}</span>
                </el-form-item>
                <el-form-item label="课程ID" >
                	<span>{{dataForm.courseId}}</span>
                </el-form-item>
                <el-form-item label="课程名称" >
                	<span>{{dataForm.courseName}}</span>
                </el-form-item>
                <el-form-item label="课程封面" v-if="dataForm.courseCover">
                	<span><img :src="dataForm.courseCover" class="logo"></span>
                </el-form-item>
                <el-form-item label="订单金额">
                	<span>{{dataForm.orderPrice}}</span>
                </el-form-item>
                <el-form-item label="余额支付" v-if="dataForm.balanceAmount">
                	<span>{{dataForm.balanceAmount}}</span>
                </el-form-item>
                <el-form-item label="积分减免" v-if="dataForm.vouchersAmount">
                	<span>{{dataForm.vouchersAmount}}</span>
                </el-form-item>
                <el-form-item label="优惠减免" v-if="dataForm.couponAmount">
                	<span>{{dataForm.couponAmount}}</span>
                </el-form-item>
                <el-form-item label="实际支付">
                	<span>{{dataForm.actualAmount}}</span>
                </el-form-item>
                <el-form-item label="订单类型">
                	<span>{{orderType[dataForm.orderType]}}</span>
                </el-form-item>
                <el-form-item label="订单状态">
                	<span>{{orderStatus[dataForm.orderStatus]}}</span>
                </el-form-item>
                <el-form-item label="是否拼单">
                	<span>{{groupStatus[dataForm.groupStatus]}}</span>
                </el-form-item>
                <el-form-item label="拼单ID" v-if="dataForm.groupId">
                	<span>{{dataForm.groupId}}</span>
                </el-form-item>
                <el-form-item label="支付类型">
                	<span>{{payType[dataForm.payType]}}</span>
                </el-form-item>
                
                <el-form-item label="用户ID">
                	<span>{{dataForm.userId}}</span>
                </el-form-item>
                <el-form-item label="用户昵称">
                	<span>{{dataForm.userNickname}}</span>
                </el-form-item>
                <el-form-item label="备注">
                	<span>{{dataForm.userRemark}}</span>
                </el-form-item>
                <el-form-item label="下单时间">
                	<span>{{dataForm.addTime}}</span>
                </el-form-item>
            </el-form>
        </el-dialog>
	</div>
</template>
<script>
import Pagination from '@/components/Pagination'
import {listClassOrder,readClassOrder} from '@/api/school'
export default{
	components:{Pagination},
	    name:'classOrder',
	    data(){
	    	return{
	    		listQuery:{
	    			status:undefined,
	    			beginTime:undefined,
	    			endTime:undefined,
	    			limit:20,
	    			page:1,
	    			sort:'update_time',
	    			order:'desc'
	    		},
	    		downQuery:{},
	    		orderStatus:['待支付','已取消','已支付','支付失败','已评价'],
	    		list:[],
	    		total:0,
	    		listLoading:false,
	    		orderType:['线下课程','视频课程'],
	    		groupStatus:['否','是'],
	    		payType:['待定','余额','小程序'],
	    		dialogFormVisible:false,
	    		dataForm:{},
	    		downloadLoading:false,
	    		downlist:[]
	    	}
	    },
	    created(){
	    	this.getList()
	    },
	    methods:{
	    	getList(){
	    		this.listLoading=true
	    		listClassOrder(this.listQuery).then((res)=>{
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
	    		this.$set(this.listQuery,'page',1)
	    		this.getList()
	    	},
	    	handleRead(row){
	    		this.dialogFormVisible=true
	    		var id=row.id
	    		readClassOrder(id).then((res)=>{
	    			if(res.data.errno==0){
	    				this.dataForm=res.data.data
	    			}
	    		})
	    	},
	    	handleDownload(){
	    		this.downloadLoading=true
	    		this.downQuery=this.listQuery
	    		this.downQuery.limit=-1
	    		listClassOrder(this.downQuery).then((res)=>{
	    			if(res.data.errno==0){
	    				this.downlist=res.data.data.items
	    				for(var i in this.downlist){
	    					this.downlist[i].orderType=this.orderType[this.downlist[i].orderType]
	    					this.downlist[i].orderStatus=this.orderStatus[this.downlist[i].orderStatus]
	    					this.downlist[i].payType=this.payType[this.downlist[i].payType]
	    					this.downlist[i].groupStatus=this.groupStatus[this.downlist[i].groupStatus]
	    				}
	    				import('@/vendor/Export2Excel').then(excel => {
	    					const tHeader = [
	    					'订单ID',
                            '订单编号',
                            '学校名称',
                            '课程Id',
                            '课程名称',
                            '订单金额',
                            '实际支付',
                            '订单类型',
                            '订单状态',
                            '是否拼单',
                            '支付类型',
                            '用户ID',
                            '下单时间',
                                                        ]
                            const filterVal = ['id', 'sn','orgName', 'courseId', 'courseName','orderPrice','actualAmount','orderType','orderStatus','groupStatus','payType','userId','addTime']
                            excel.export_json_to_excel2(
                            	tHeader,
                            	this.downlist,
                            	filterVal,
                                '课程订单信息'
                            )
                            this.downloadLoading = false
                        })
	    			}else{
	    				this.downloadLoading=false
	    				this.$notify.error({
	    					title:'失败',
	    					message:'导出失败'
	    				})
	    			}
	    		})
	    	}
	    }
}
</script>
<style>
.logo{
	 width: 145px;
        height: 145px;
        display: block;
}
</style>