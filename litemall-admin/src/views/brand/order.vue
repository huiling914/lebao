<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.user" clearable class="filter-item" style="width: 200px;"
                      placeholder="请输入用户ID"/>
            <el-input v-model="listQuery.sn" clearable class="filter-item" style="width: 200px;" placeholder="请输入订单编号"/>
            <el-select v-model="listQuery.status" clearable style="width: 200px" class="filter-item"
                       placeholder="请选择订单状态">
                <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value"/>
            </el-select>
             <el-date-picker
                  class="filter-item"
                  value-format="yyyyMMdd"
                  v-model="beginTime"
                  type="date"
                  placeholder="选择开始日期"
                  @change="begintimeChange">
            </el-date-picker>
             <el-date-picker
                  class="filter-item"
                  value-format="yyyyMMdd"
                  v-model="endTime"
                  type="date"
                  placeholder="选择结束日期"
                  @change="endtimeChange">
            </el-date-picker>
            <el-button v-permission="['GET /admin/order/list']" class="filter-item"  type="primary" icon="el-icon-search"
                       @click="handleFilter">查找
            </el-button>
            <el-button :loading="downloadLoading" class="filter-item" type="primary"   icon="el-icon-download"
                       @click="handleDownload">导出
            </el-button>
        </div>

        <!-- 查询结果 -->
        <div style="height: calc(100% - 155px);overflow: hidden">
            <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">

                <el-table-column align="center" min-width="200" label="订单编号" prop="orderSn"/>

                <el-table-column align="center" min-width="50" label="用户ID" prop="userId"/>

                <el-table-column align="center" label="商场名称" min-width="150" prop="orgName"/>


                <el-table-column align="center" label="订单状态" min-width="120" prop="orderStatus">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.orderStatus | orderStatusFilter }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="订单金额" prop="orderPrice"/>

                <el-table-column align="center" label="实付金额" prop="actualPrice"/>

                <el-table-column align="center" label="下单时间" prop="addTime"/>

                <el-table-column align="center" label="更新时间" prop="updateTime"/>

                <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button v-permission="['GET /admin/order/detail']" type="primary" size="mini"
                                   @click="handleDetail(scope.row)">详情
                        </el-button>
                        <el-button v-permission="['POST /admin/order/ship']" v-if="scope.row.orderStatus==201"
                                   type="primary" size="mini" @click="handleShip(scope.row)">发货
                        </el-button>
                        <el-button v-permission="['POST /admin/order/refund']" v-if="scope.row.orderStatus==202"
                                   type="primary" size="mini" @click="handleRefund(scope.row)">退款
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>

        <!-- 订单详情对话框 -->
        <el-dialog :visible.sync="orderDialogVisible" title="订单详情" width="800" :close-on-click-modal="false">

            <el-form :data="orderDetail" label-position="left">
                <el-form-item label="订单编号">
                    <span>{{ orderDetail.orderSn }}</span>
                </el-form-item>
                <el-form-item label="用户ID">
                    <span>{{ orderDetail.userId }}</span>
                </el-form-item>
                <el-form-item label="用户名">
                    <span>{{ orderDetail.userName }}</span>
                </el-form-item>
                <el-form-item label="商城名称">
                    <span>{{ orderDetail.orgName }}</span>
                </el-form-item>
                <el-form-item label="订单金额">
                    <span>{{ orderDetail.orderPrice }}</span>
                </el-form-item>
                <el-form-item label="支付金额">
                    <span>{{ orderDetail.actualPrice }}</span>
                </el-form-item>
                <el-form-item label="订单状态">
                    <span> {{orderDetail.orderStatus | orderStatusFilter }}</span>
                </el-form-item>
                <el-form-item label="下单时间">
                    <span>{{ orderDetail.addTime }}</span>
                </el-form-item>
                <el-form-item label="最近更新时间">
                    <span>{{ orderDetail.updateTime }}</span>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 发货对话框 -->
        <el-dialog :visible.sync="shipDialogVisible" title="发货">
            <el-form ref="shipForm" :model="shipForm" status-icon label-position="left" label-width="100px"
                     style="width: 400px; margin-left:50px;">
                <el-form-item label="快递公司" prop="shipChannel">
                    <el-input v-model="shipForm.shipChannel"/>
                </el-form-item>
                <el-form-item label="快递编号" prop="shipSn">
                    <el-input v-model="shipForm.shipSn"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="shipDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmShip">确定</el-button>
            </div>
        </el-dialog>

        <!-- 退款对话框 -->
        <el-dialog :visible.sync="refundDialogVisible" title="退款">
            <el-form ref="refundForm" :model="refundForm" status-icon label-position="left" label-width="100px"
                     style="width: 400px; margin-left:50px;">
                <el-form-item label="退款金额" prop="refundMoney">
                    <el-input v-model="refundForm.refundMoney" :disabled="true"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="refundDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmRefund">确定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<style>

</style>

<script>
    import {listOrder, shipOrder, refundOrder, detailOrder} from '@/api/order'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import checkPermission from '@/utils/permission' // 权限判断函数
    import {handleDownload} from '@/utils/commen'
    const statusMap = {
        0: '待支付',
        1: '支付完成，待评价',
        2: '退款受理',
        3: '订单已取消',
        4: '已评价，订单完成',

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
                    user: undefined,    // 用户id
                    brand: undefined,    // 商户id
                    sn: "",
                    type: 0,    // 订单类型, 0-商户, 1-学校
                    status: undefined,    // 订单状态
                    page: 1,    // 页数
                    limit: 20,    // 每页容量
                    sort: "update_time",    // 排序字段
                    order: "desc",    // 排序规则
                    beginTime:undefined,
                    endTime:undefined
                },
                statusMap,
                orderDialogVisible: false,
                orderDetail: {
                    orderSn: undefined,
                    userId: undefined,
                    userName: undefined,
                    orgName: undefined,
                    orderPrice: undefined,
                    actualPrice: undefined,
                    orderStatus: undefined,
                    addTime: undefined,
                    updateTime: undefined,


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
                listOrder(this.listQuery).then(response => {
                    console.log(response)
                    this.list = response.data.data.items
                    this.total = response.data.data.total
                    this.listLoading = false
                }).catch(() => {
                    this.list = []
                    this.total = 0
                    this.listLoading = false
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getList()
            },
            handleDetail(row) {
                console.log(row)
                this.orderDetail = row
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
                const tHeader = ['订单编号', '用户ID', '商城名称', '订单状态', '订单金额', '实付金额', '下单时间', '最近更新时间']
                const filterVal = ['orderSn', 'userId', 'orgName', 'orderStatus', 'orderPrice', 'actualPrice', 'addTime', 'updateTime']
                var downQuery=this.listQuery
                downQuery.limit=-1
                handleDownload(tHeader,filterVal,downQuery,'商家订单信息',listOrder)
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
