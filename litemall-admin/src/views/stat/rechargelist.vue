<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.user" clearable class="filter-item" style="width: 160px;"
                      placeholder="请输入用户ID"/>
            <el-input v-model="listQuery.sn" clearable class="filter-item" style="width: 160px;" placeholder="请输入订单编号"/>
            <el-select v-model="listQuery.status" clearable style="width: 160px" class="filter-item"
                       placeholder="请选择充值状态">
                <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value"/>
            </el-select>
            <el-date-picker
                  class="filter-item"
                  style="width: 160px"
                  value-format="yyyyMMdd"
                  v-model="beginTime"
                  type="date"
                  placeholder="选择开始日期"
                  @change="begintimeChange">
            </el-date-picker>
             <el-date-picker
                  class="filter-item"
                  style="width: 160px"
                  value-format="yyyyMMdd"
                  v-model="endTime"
                  type="date"
                  placeholder="选择结束日期"
                  @change="endtimeChange">
            </el-date-picker>
    </el-date-picker>
            <el-button v-permission="['GET /admin/order/list']" class="filter-item"   type="primary" icon="el-icon-search"
                       @click="handleFilter">查找
            </el-button>
            <el-button :loading="downloadLoading" class="filter-item" type="primary"   icon="el-icon-download"
                       @click="handleDownload">导出
            </el-button>
            <div class="filter-item" style="width: 20px;"></div>
            <div class="filter-item" style="color:gray">充值金额：￥{{this.sumMoney}}</div>

        </div>


        <!-- 查询结果 -->
        <div style="height: calc(100% - 155px);overflow: hidden">
            <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">

                <el-table-column align="center" min-width="100" label="订单编号" prop="balanceChargeSn"/>

                <el-table-column align="center" label="用户ID" prop="uid"/>

                <el-table-column align="center" label="充值状态" prop="status">
                    <template slot-scope="scope">
                        <el-tag>{{ statusDic[scope.row.status]}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="充值类型" prop="chargeType">
                    <template slot-scope="scope">
                        <el-tag>{{ chargeTypeDic[scope.row.chargeType]}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="充值金额(元)" prop="chargeMoney"/>

                <el-table-column align="center" label="充值时间" prop="chargeTime"/>

                <!--  <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                      <el-button v-permission="['GET /admin/order/detail']" type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
                      <el-button v-permission="['POST /admin/order/ship']" v-if="scope.row.orderStatus==201" type="primary" size="mini" @click="handleShip(scope.row)">发货</el-button>
                      <el-button v-permission="['POST /admin/order/refund']" v-if="scope.row.orderStatus==202" type="primary" size="mini" @click="handleRefund(scope.row)">退款</el-button>
                    </template>
                  </el-table-column>-->
            </el-table>
        </div>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>

    </div>
</template>

<style>

</style>

<script>
    import {listRecharge} from '@/api/recharge'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import checkPermission from '@/utils/permission' // 权限判断函数
    import {handleDownload} from '@/utils/commen'
    const statusMap = {
        0: '充值中',
        1: '充值成功',
        2: '充值失败',
    }

    export default {
        name: 'Order',
        components: {Pagination},
        filters: {
            orderStatusFilter(status) {
                return statusMap[status]
            }
        },
        data() {
            return {
                list: undefined,
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    user: undefined,
                    name: undefined,
                    sn: undefined,
                    status: undefined,
                    sort: 'charge_time',
                    order: 'desc',
                    beginTime:undefined,
                    endTime:undefined
                },
                statusMap,
                orderDialogVisible: false,
                orderDetail: {
                    order: {},
                    user: {},
                    orderGoods: []
                },
                shipForm: {
                    orderId: undefined,
                    shipChannel: undefined,
                    shipSn: undefined
                },
                shipDialogVisible: false,
                refundForm: {
                    orderId: undefined,
                    refundMoney: undefined
                },
                refundDialogVisible: false,
                downloadLoading: false,
                statusDic: ['充值中', '充值成功', '充值失败'],
                chargeTypeDic: ['微信H5充值', '支付宝充值', '微信公众号充值', '微信小程序充值'],
                sumMoney: 0,
                beginTime: '',
                endTime:''
            }

        },
        created() {
            this.getList()
        },
        methods: {
            checkPermission,
            getList() {
                this.listLoading = true
                listRecharge(this.listQuery).then(response => {
                    this.list = response.data.data.items
                    this.total = response.data.data.total
                    this.listLoading = false;
                    this.sumMoney = 0;
                    for (var i in this.list) {
                        //console.log(this.list[i].chargeMoney)
                        this.sumMoney = this.sumMoney + parseFloat(this.list[i].chargeMoney)
                    }
                    this.sumMoney = Math.round(this.sumMoney * 100) / 100
                }).catch((e) => {
                    this.list = []
                    this.total = 0
                    this.listLoading = false
                })
            },
            handleFilter() {
                this.sumMoney = 0
                this.listQuery.page = 1
                this.getList()
            },
            handleDetail(row) {
                detailOrder(row.id).then(response => {
                    this.orderDetail = response.data.data
                })
                this.orderDialogVisible = true
            },
            handleShip(row) {
                this.shipForm.orderId = row.id
                this.shipForm.shipChannel = row.shipChannel
                this.shipForm.shipSn = row.shipSn

                this.shipDialogVisible = true
                this.$nextTick(() => {
                    this.$refs['shipForm'].clearValidate()
                })
            },
            confirmShip() {
                this.$refs['shipForm'].validate((valid) => {
                    if (valid) {
                        shipOrder(this.shipForm).then(response => {
                            this.shipDialogVisible = false
                            this.$notify.success({
                                title: '成功',
                                message: '确认发货成功'
                            })
                            this.getList()
                        }).catch(response => {
                            this.$notify.error({
                                title: '失败',
                                message: response.data.errmsg
                            })
                        })
                    }
                })
            },
            handleRefund(row) {
                this.refundForm.orderId = row.id
                this.refundForm.refundMoney = row.actualPrice

                this.refundDialogVisible = true
                this.$nextTick(() => {
                    this.$refs['refundForm'].clearValidate()
                })
            },
            confirmRefund() {
                this.$refs['refundForm'].validate((valid) => {
                    if (valid) {
                        refundOrder(this.refundForm).then(response => {
                            this.refundDialogVisible = false
                            this.$notify.success({
                                title: '成功',
                                message: '确认退款成功'
                            })
                            this.getList()
                        }).catch(response => {
                            this.$notify.error({
                                title: '失败',
                                message: response.data.errmsg
                            })
                        })
                    }
                })
            },
            handleDownload() {
                this.downloadLoading = true
                const tHeader = ['订单ID', '订单编号', '用户ID', '订单状态', '是否删除', '收货人', '收货联系电话', '收货地址']
                const filterVal = ['id', 'orderSn', 'userId', 'orderStatus', 'isDelete', 'consignee', 'mobile', 'address']
                var downQuery=this.listQuery
                downQuery.limit=-1
                handleDownload(tHeader,filterVal,downQuery,'充值记录',listRecharge)
                this.downloadLoading=false
            },
           begintimeChange(val) {
            console.log(val)
            if(val){
                this.listQuery.beginTime=val
                }else{
                    this.listQuery.beginTime=''
                }
        },
        endtimeChange(val) {
            console.log(val)
            if(val){
                this.listQuery.endTime=val
                }else{
                    this.listQuery.endTime=''
                }
        }
        },
        watch:{
          'listQuery.user':function(val,oldVal){
            if(!val){
              this.getList()
            }
          },
          'listQuery.sn':function(val,oldVal){
            if(!val){
              this.getList()
            }
          },
          'listQuery.status':function(val,oldVal){
            if(!val){
              this.getList()
            }
          },
          'beginTime':function(val,oldVal){
            if(!val){
              this.getList()
            }
          },
          'endTime':function(val,oldVal){
            if(!val){
              this.getList()
            }
          }
        }
    }
</script>
