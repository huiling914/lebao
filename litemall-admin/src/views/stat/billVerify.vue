<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-date-picker
			  v-model="listQuery.date"
        class="filter-item"
        type="date"
        value-format="yyyyMMdd"
        placeholder="选择日期"
        clearable >
      </el-date-picker>
      <el-button v-permission="['GET /trade/bill/verify/detail']" class="filter-item" type="primary" icon="el-icon-search"
                       @click="handleFilter">查找
      </el-button>
		</div>
		<!--查询结果-->
    <div style="height: calc(100% - 155px);overflow: hidden">
      <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row height="100%" >
        <el-table-column type="index" align="center" label="序号" width="50"/>
        <el-table-column align="center" label="充值时间" prop="tradeTime"/>
        <el-table-column align="center" label="手续费" prop="serviceCharge"/>
        <el-table-column align="center" label="微信平台充值金额" prop="orderAmount"/>
        <el-table-column align="center" label="交易状态" prop="tradeStatus">
          <template slot-scope="scope">
                        <el-tag>{{ scope.row.tradeStatus | statusFilter }}</el-tag>
                    </template>
        </el-table-column>
        <el-table-column align="center" label="微信订单号" prop="transactionId"/>
      </el-table>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList"/>
	</div>
</template>
<script>
	  import {getToken} from '@/utils/auth'
    import Pagination from '@/components/Pagination'
    import {statBillVerify} from '@/api/stat'
    const statusMap={
      'SUCCESS':'成功'
    }
    export default{
    	name:'billVerify',
    	components:{Pagination},
      filters:{
        statusFilter(tradeStatus){
          return statusMap[tradeStatus]
        }
      },
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
          limit:10
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
          
          statBillVerify(this.listQuery).then((response)=>{
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
        }
      }
    }
</script>