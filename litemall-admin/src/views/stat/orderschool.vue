<template>
  <div class="app-container">
    <!--查询和其他操作-->
    <div class="filter-container">
      <el-date-picker v-model="listQuery.beginTime" class="filter-item" clearable type="date" value-format="yyyyMMdd" align="right" placeholder="起始日期"/><span class="filter-item">&nbsp;至</span>
      <el-date-picker v-model="listQuery.endTime" class="filter-item" clearable type="date" value-format="yyyyMMdd" align="right" placeholder="结束日期"/>
      <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>
    <ve-line :extend="chartExtend" :data="chartData" :settings="chartSettings"/>
  </div>
</template>

<script>
import { statOrder } from '@/api/stat'
import VeLine from 'v-charts/lib/line'
export default {
  components: { VeLine },
  data() {
    return {
      chartData: {},
      chartSettings: {},
      chartExtend: {},
       listQuery: {
        type: 1,
        beginTime: undefined,
        endTime: undefined,
      },
    }
  },
  
  created() {
    this.getData()
  },
  watch:{
          'listQuery.beginTime':function(val,oldVal){
            if(!val){
              this.getData()
            }
          },
          'listQuery.endTime':function(val,oldVal){
            if(!val){
              this.getData()
            }
          },
          
        },
  methods:{
    getData(){
      statOrder(this.listQuery).then(response => {
      this.chartData = response.data.data
      if(this.chartData.rows=[]){
        
        if(this.listQuery.beginTime){
          this.chartData.rows.push({amount:0,orders:0,customers:0,pcr:0,day:this.transDate(this.listQuery.beginTime)})
        }
        if(this.listQuery.endTime){
          this.chartData.rows.push({amount:0,orders:0,customers:0,pcr:0,day:this.transDate(this.listQuery.endTime)})
        }
        if(!this.listQuery.endTime&&!this.listQuery.beginTime){
          this.chartData.rows.push({amount:0,orders:0,customers:0,pcr:0,day:this.getNowFormatDate()})
        }

      }
      //console.log(response)
      this.chartSettings = {
        labelMap: {
          'orders': '订单量',
          'customers': '下单用户',
          'amount': '订单总额',
          'pcr': '人均消费'
        }
      }
      this.chartExtend = {
        xAxis: { boundaryGap: true }
      }
    })
    },
    handleFilter(){
      this.getData()
    },
    getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },
    //转化日期格式
    transDate(date){
      var toDate=date.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
      return toDate
    }
  }

}
</script>
