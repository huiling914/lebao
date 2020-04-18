<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-date-picker
			  v-model="listQuery.date"
        type="date"
        value-format="yyyyMMdd"
        placeholder="选择日期"
         >
      </el-date-picker>
      <el-button v-permission="['GET /trade/bill/verify/detail']" class="filter-container" type="primary" icon="el-icon-search"
                       @click="handleFilter">查找
      </el-button>
      <!-- <el-button :loading="downloadLoading" class="filter-container" type="primary" icon="el-icon-download"
                       @click="handleDownload">导出
            </el-button> -->
		</div>
		<!--查询结果-->
    <div style="height: calc(100% - 155px);overflow: hidden">
      <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row height="100%" >
        <el-table-column type="index" align="center" label="序号" width="50"/>
        <el-table-column align="center" label="记账时间" prop="tradeTime"/>
        <el-table-column align="center" label="微信支付业务单号" prop="paymentNumber"/>
        <el-table-column align="center" label="资金流水单号" prop="flowNumber"/>
        <el-table-column align="center" label="业务名称" prop="businessName"/>         
        <el-table-column align="center" label="业务类型" prop="businessType"/>
        <el-table-column align="center" label="收支类型" prop="inoutType"/>
        <el-table-column align="center" label="收支金额" prop="inoutMoney"/>
        <el-table-column align="center" label="账户结余" prop="accountBalance"/>
        <el-table-column align="center" label="资金变更提交申请人" prop="applicant"/>
        <el-table-column align="center" label="备注" prop="remarks"/>
        <el-table-column align="center" label="业务凭证号" prop="voucherNumber"/>
      </el-table>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList"/>
	</div>
</template>
<script>
	  import {getToken} from '@/utils/auth'
    import Pagination from '@/components/Pagination'
    import {statBillFundflow} from '@/api/stat'
    import {handleDownload} from '@/utils/commen'
    
    export default{
    	name:'statBillFundflow',
    	components:{Pagination},
      
    	data(){
    		return{
    			listQuery:{
    				date:undefined
    			},
          allList:undefined,
          list:[],
          listLoading:true,
          total:0,
          page:1,
          limit:10,
          downloadLoading:false
    		}
    	},
      created(){
        this.getList()
      },
      methods:{
        getList(){
          this.list=[]
          //console.log(this.page)
          if(!this.listQuery.date){
            this.listQuery.date=this.getCurrentDate()
          }
          
          statBillFundflow(this.listQuery).then((response)=>{
            this.listLoading=true
            this.allList=response.data.data.items;
            //console.log(response.data);
            if(response.data.data.totalNum){
              this.total=this.allList.length;
            }
            
            //console.log('aa'+this.total)
            for(var i=(this.page-1)*this.limit;i<this.page*this.limit;i++){
              if(i>=this.allList.length){
                break;
              }else{
                this.list.push(this.allList[i])
              }
            }
            //console.log(this.list)
            this.listLoading=false

          }).catch((error)=>{
            this.listLoading=false
          })
        },
        
        handleFilter(){
          this.getList()
        },
        getCurrentDate(){
          var date=new Date()
          var month=date.getMonth()+1
          var strDate=date.getDate()-1
          if(month>=1&&month<=9){
            month="0"+month
          }
          if(strDate>=1&&strDate<=9){
            strDate="0"+strDate
          }
          var currentDate=date.getFullYear()+""+month+""+strDate
          return currentDate
        },
        handleDownload() {
                this.downloadLoading = true
                const tHeader = ['记账时间', '微信支付业务单号', '资金流水单号', '业务名称', '业务类型','收支类型','收支金额','账户结余','资金变更提交申请人','备注','业务凭证号']
                const filterVal = ['tradeTime', 'paymentNumber', 'flowNumber', 'businessName', 'businessType', 'inoutType', 'inoutMoney','accountBalance','applicant','remarks','voucherNumber']
                var downQuery=this.listQuery
                downQuery.limit=-1

                handleDownload(tHeader,filterVal,downQuery,'资金流水账单',statBillFundflow)

                this.downloadLoading=false
            }
      }
    }
</script>