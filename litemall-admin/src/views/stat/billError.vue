<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
            <!-- <el-date-picker v-model="value1" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="充值起始日期" end-placeholder="充值结束日期" value-format="yyyyMMdd" @change="timeChange1"/>
            <el-date-picker v-model="value2" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="对账起始日期" end-placeholder="对账结束日期" value-format="yyyyMMdd" @change="timeChange2"/> -->
			<el-date-picker v-model="listQuery.chargeBegin" class="filter-item" clearable type="date" style="width: 160px;" placeholder="充值起始日期" value-format="yyyyMMdd">
			</el-date-picker><span class="filter-item">&nbsp;至</span>
			<el-date-picker v-model="listQuery.chargeEnd" class="filter-item" clearable type="date" style="width: 160px;" placeholder="充值结束日期" value-format="yyyyMMdd">
			</el-date-picker>&nbsp; 
			<el-date-picker v-model="listQuery.addBegin" class="filter-item" clearable type="date" style="width: 160px;" placeholder="对账起始日期" value-format="yyyyMMdd">
			</el-date-picker><span class="filter-item">&nbsp;至</span>
			<el-date-picker v-model="listQuery.addEnd" class="filter-item" clearable type="date" style="width: 160px;" placeholder="对账结束日期" value-format="yyyyMMdd">
			</el-date-picker>&nbsp; 
			<el-select v-model="listQuery.abnomalType" class="filter-item" clearable tyle="width: 160px" placeholder="请选择异常类型">
				<el-option v-for="item in abnomalType" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-select v-model="listQuery.checkStatus" class="filter-item" clearable tyle="width: 160px" placeholder="请选择处理状态">
				<el-option v-for="item in checkStatus" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-select v-model="listQuery.checkResult" class="filter-item" clearable tyle="width: 160px" placeholder="请选择处理结果">
				<el-option v-for="item in checkResult" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-button v-permission="['GET /trade/bill/verify/detail']"  class="filter-item" type="primary" icon="el-icon-search"
                       @click="handleFilter">查找
            </el-button>
      <el-button :loading="downloadLoading"  type="primary" class="filter-item" icon="el-icon-download"
                       @click="handleDownload">导出
      </el-button>

		</div>
		<!--查询结果-->
		<div style="height: calc(100% - 155px);overflow: hidden">
		 	<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row height="100%" >
		 		<el-table-column align="center" label="用户ID" prop="userId"/>
		 		<el-table-column align="center" label="用户昵称" prop="userName"/>
		 		<el-table-column align="center" label="充值时间" prop="chargeTime"/>
		 		<el-table-column align="center" label="对账时间" prop="addTime"/>
		 		<el-table-column align="center" label="异常类型" prop="abnomalType">
		 			<template slot-scope="scope">
                        <el-tag>{{ scope.row.abnomalType | abnomalFilter }}</el-tag>
                    </template>
		 		</el-table-column>
		 		<el-table-column align="center" label="处理状态" prop="checkStatus">
		 			<template slot-scope="scope">
                        <el-tag>{{ scope.row.checkStatus | statusFilter }}</el-tag>
                    </template>
		 		</el-table-column>
		 		<el-table-column align="center" label="处理结果" prop="checkResult">
		 			<template slot-scope="scope">
                        <el-tag>{{ scope.row.checkResult | resultFilter }}</el-tag>
                    </template>
		 		</el-table-column>
		 		<el-table-column align="center" label="处理人" prop="adminName"/>
		 		<el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button  type="primary" size="mini" @click="handleRead(scope.row)">详情</el-button>
                                               
                    </template>
                </el-table-column>
		 	</el-table>
		 	
		</div>
		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>
        <!--详情-->
        <el-dialog title="查看详情" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :top="'0'">
        	<el-form ref="dataForm"  :model="dataForm" status-icon label-position="left"
                     label-width="130px" style="width: 400px; margin-left:50px;">
                     <el-form-item label="用户ID" prop="userId">
                     	<el-input v-model="dataForm.userId" :readonly="true"/>

                     </el-form-item>
                     <el-form-item label="用户昵称" prop="userName">
                     	<el-input v-model="dataForm.userName" :readonly="true"/>
                     </el-form-item>
                     <el-form-item label="充值记录ID" prop="chargeId">
                     	<el-input v-model="dataForm.chargeId" :readonly="true"/>
                     </el-form-item>
                     <el-form-item label="充值记录SN" prop="chargeSn">
                     	<el-input v-model="dataForm.chargeSn" :readonly="true"/>
                     </el-form-item>
                     <el-form-item label="微信平台订单号" prop="tradeNo">
                     	<el-input v-model="dataForm.tradeNo" :readonly="true"/>
                     </el-form-item>
                     <el-form-item label="己方充值状态" prop="srcStatus">
                     	<el-input v-model="dataForm.srcStatus" :readonly="true"/>
                     </el-form-item>
                     <el-form-item label="微信到账状态" prop="targetStatus">
                     	<el-input v-model="dataForm.targetStatus" :readonly="true"/>
                     </el-form-item>
                     <el-form-item label="己方充值金额" prop="srcMoney">
                     	<el-input v-model="dataForm.srcMoney" :readonly="true"/>
                     </el-form-item>
                     <el-form-item label="微信平台充值金额" prop="targetMoney">
                     	<el-input v-model="dataForm.targetMoney" :readonly="true"/>
                     </el-form-item>
                     <el-form-item label="己方系统充值时间" prop="chargeTime">
                     	<el-input v-model="dataForm.chargeTime" :readonly="true"/>
                     </el-form-item>
                     <el-form-item label="微信平台确认时间" prop="confirmTime">
                     	<el-input v-model="dataForm.confirmTime" :readonly="true"/>
                     </el-form-item>
                     <el-form-item label="异常类型" prop="abnomalType">
                     	<el-input v-model="dataForm.abnomalType" :readonly="true"/>
                     </el-form-item>
                     <el-form-item label="处理状态" prop="checkStatus">
                     	<el-input v-model="dataForm.checkStatus" :readonly="true"/>
                     </el-form-item>
                     <el-form-item label="处理结果" prop="checkResult">
                     	<el-input v-model="dataForm.checkResult" :readonly="true"/>
                     </el-form-item>
                     <el-form-item label="对账时间" prop="addTime">
                     	<el-input v-model="dataForm.addTime" :readonly="true"/>
                     </el-form-item>
                     <el-form-item label="处理人用户名" prop="adminName">
                     	<el-input v-model="dataForm.adminName" :readonly="true"/>
                     </el-form-item>
            </el-form>
             <div slot="footer" class="dialog-footer">
             	<el-button @click="dialogFormVisible = false" type="primary">确定</el-button>
                <el-button @click="dialogFormVisible = false">取消</el-button>
               
            </div>
        </el-dialog>
	</div>
</template>
<script>
	import {getToken} from '@/utils/auth'
    import Pagination from '@/components/Pagination'
    import {statBillError} from '@/api/stat'
    const abnomalMap={
    	1:'交易状态',
    	2:'金额',
    	3:'交易状态/金额'
    }
    const statusMap={
    	0:'未处理',
    	1:'自动处理',
    	2:'人工处理'
    }
    const resultMap={
    	0:'未处理',
    	1:'同意',
    	2:'拒绝'
    }
    const chargeMap={
    	0:'充值中',
    	1:'充值成功',
    	2:'充值失败'
    }
    export default{
    	name:'billError',
    	components:{Pagination},
    	filters:{
    		abnomalFilter(abnomalType){
    			return abnomalMap[abnomalType]
    		},
    		statusFilter(checkStatus){
    			return statusMap[checkStatus]
    		},
    		resultFilter(checkResult){
    			return resultMap[checkResult]
    		}
    	},
    	data(){
    		return{
    			listLoading:false,
    			list:undefined,
    			total:0,
    			dialogFormVisible:false,
    			value1:undefined,
                value2:undefined,
    			listQuery:{
    				sn:undefined,
    				tradeNo:undefined,
    				chargeBegin:undefined,
    				chargeEnd:undefined,
    				addBegin:undefined,
    				addEnd:undefined,
    				abnomalType:undefined,
    				checkStatus:undefined,
    				checkResult:undefined,
    				page:1,
    				limit:10,
    				sort: "charge_time", 
    				order:"desc"

    			},
    			dataForm:{},
    			abnomalType:[
    			{
    				value:1,
    				label:'交易状态'
    			},
    			{
    				value:2,
    				label:'金额'
    			},
    			{
    				value:3,
    				label:'交易状态&金额'
    			}
    			],
    			checkStatus:[
    			{
    				value:0,
    				label:'未处理'
    			},
    			{
    				value:1,
    				label:'自动处理'
    			},
    			{
    				value:2,
    				label:'人工处理'
    			}
    			],
    			checkResult:[
    			{
    				value:0,
    				label:'未处理'
    			},
    			{
    				value:1,
    				label:'同意'
    			},
    			{
    				value:3,
    				label:'拒绝'
    			}
    			]
    		}
    	},
        watch:{
            'listQuery.chargeBegin':function(val,oldVal){
            if(!val){
              this.getList()
            }
          },
          'listQuery.chargeEnd':function(val,oldVal){
            if(!val){
              this.getList()
            }
          },
          'listQuery.addBegin':function(val,oldVal){
            if(!val){
              this.getList()
            }
          },
          'listQuery.addEnd':function(val,oldVal){
            if(!val){
              this.getList()
            }
          },
          'listQuery.abnomalType':function(val,oldVal){
            if(!val){
              this.getList()
            }
          },
          'listQuery.checkStatus':function(val,oldVal){
            if(!val){
              this.getList()
            }
          },
          'listQuery.checkResult':function(val,oldVal){
            if(!val){
              this.getList()
            }
          },
        },
    	methods:{
    		getList(){
    			statBillError(this.listQuery).then((response)=>{
    				this.list=response.data.data.items
    				this.total=response.data.data.total
    			}).catch((error)=>{
    				console.log(error)
    			})
    		},
    		handleFilter(){
    			this.getList()
    		},
    		handleRead(row){
    			this.dataForm=Object.assign({}, row)
    			this.dialogFormVisible=true
    			this.dataForm.srcStatus=chargeMap[this.dataForm.srcStatus]
    			this.dataForm.targetStatus=chargeMap[this.dataForm.targetStatus]
    			this.dataForm.abnomalType=abnomalMap[this.dataForm.abnomalType]
    			this.dataForm.checkStatus=statusMap[this.dataForm.checkStatus]
    			this.dataForm.checkResult=resultMap[this.dataForm.checkResult]
    			//console.log(this.dataForm.srcStatus)
    			
    		},
    		timeChange1(){
                //console.log(this.value1)
                if(this.value1){
                    this.listQuery.chargeBegin=this.value1[0]
                    this.listQuery.chargeEnd=this.value1[1]
                }else{
                    this.listQuery.chargeBegin=undefined
                    this.listQuery.chargeEnd=undefined
                }
            },
            timeChange2(){
                if(this.value2){
                    this.listQuery.addBegin=this.value2[0]
                    this.listQuery.addEnd=this.value2[1]
                }else{
                    this.listQuery.addBegin=undefined
                    this.listQuery.addEnd=undefined
                }
            },
            handleDownload() {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['用户ID', '用户昵称', '充值时间', '对账时间', '异常类型', '处理状态','处理结果','处理人']
                    const filterVal = ['userId', 'userName', 'chargeTime', 'addTime', 'abnomalType', 'checkStatus', 'checkResult','adminName']
                    excel.export_json_to_excel2(tHeader, this.list, filterVal, '学校退款信息')
                    this.downloadLoading = false
                })
            }
    	},
    	created(){
    		this.getList()
    	}

    }
</script>