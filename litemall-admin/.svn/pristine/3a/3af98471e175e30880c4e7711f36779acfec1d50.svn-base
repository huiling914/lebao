<template>
  <div class="app-container">
    <!--查询和其他操作-->
    <div class="filter-container">
      <el-date-picker v-model="listQuery.beginTime" class="filter-item" clearable type="date" value-format="yyyyMMdd" align="right" placeholder="起始日期"/><span class="filter-item">&nbsp;至</span>
            <el-date-picker v-model="listQuery.endTime" class="filter-item" clearable type="date" value-format="yyyyMMdd" align="right" placeholder="结束日期"/>
      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>
    <ve-histogram :extend="chartExtend" :data="chartData" :settings="chartSettings"/>
  </div>
</template>

<script>
import { statUser } from '@/api/stat'
import VeHistogram from 'v-charts/lib/histogram'

export default {
  components: { VeHistogram },
  name:"statUser",
  data() {
    return {
      chartData: {},
      chartSettings: {},
      chartExtend: {},
      listQuery:{
        beginTime:undefined,
        endTime:undefined
      }
    }
  },
  created() {
    statUser(this.listQuery).then(response => {
      this.chartData = response.data.data
      console.log(response)
      this.chartSettings = {
        labelMap: {
          'users': '用户增长数'
        }
      }
      this.chartExtend = {
        xAxis: { boundaryGap: true },
        series: {
          label: { show: true, position: 'top' }
        }
      }
    })
  },
  methods:{
    handleFilter(){
      statUser(this.listQuery).then(response => {
      this.chartData = response.data.data
      console.log(response)
      this.chartSettings = {
        labelMap: {
          'users': '用户增长数'
        }
      }
      this.chartExtend = {
        xAxis: { boundaryGap: true },
        series: {
          label: { show: true, position: 'top' }
        }
      }
    })
    }
  }

}
</script>
