<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.user" clearable class="filter-item" style="width:200px;"
                      placeholder="请输入用户ID"/>
            <el-input v-model="listQuery.sn" clearable class="filter-item" style="width: 200px;" placeholder="请输入提现编号"/>
            <el-select v-model="listQuery.status" clearable style="width: 200px" class="filter-item"
                       placeholder="请选择提现状态">
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
  </el-date-picker>
            <el-button v-permission="['GET /admin/order/list']" class="filter-item"  type="primary" icon="el-icon-search"
                       @click="handleFilter">查找
            </el-button>
            <el-button :loading="downloadLoading" class="filter-item" type="primary"  icon="el-icon-download"
                       @click="handleDownload">导出
            </el-button>
        </div>

        <!-- 查询结果 -->
        <div style="height: calc(100% - 155px);overflow: hidden">
            <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">

                <el-table-column align="center" style="width: 50px;" label="用户ID" prop="userId"/>

                <el-table-column align="center" style="width: 50px;" label="用户名称" prop="bankCardHolder"/>

                <el-table-column align="center" min-width="200" label="提现编号" prop="withdrawDepositApplySn"/>

                <el-table-column align="center"  min-width="100"  label="提现状态" prop="status">
                    <template slot-scope="scope">
                        <el-tag>{{ statusDic[scope.row.status]}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="提现金额" prop="money"/>

                <el-table-column align="center" min-width="200" label="收款银行账户" prop="bankCardNo"/>

                <el-table-column align="center" min-width="200" label="收款银行名称" prop="bankName"/>

                <el-table-column align="center" label="银行图标">
                    <template slot-scope="scope">
                        <img v-if="scope.row.bankPicUrl" :src="scope.row.bankPicUrl" width="40">
                    </template>
                </el-table-column>

                <el-table-column align="center" min-width="200" label="申请时间" prop="applyTime"/>


                <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button v-permission="['GET /admin/order/detail']" type="primary"
                                   @click="handleAudit(scope.row)">审核
                        </el-button>
                        <el-button v-permission="['GET /admin/order/detail']" type="primary"
                                   @click="handleWithdraw(scope.row)">提现确认
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 审核对话框 -->
        <el-dialog :visible.sync="AuditDialogVisible" :title="审核" :close-on-click-modal="false">
            <el-form ref="AuditForm" :model="AuditForm" status-icon label-position="left" label-width="100px"
                     style="width: 400px; margin-left:50px;">
                <el-form-item label="审核意见" prop="feedback">
                    <el-input type="textarea" :rows="3" v-model="AuditForm.feedback"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="AuditSuccess">审核通过</el-button>
                <el-button type="primary" @click="AuditFault">审核失败</el-button>
                <el-button @click="AuditDialogVisible = false">取消</el-button>
            </div>
        </el-dialog>

        <!-- 提现对话框 -->
        <el-dialog :visible.sync="WithdrawDialogVisible" title="提现" :close-on-click-modal="false">
            <el-form ref="WithdrawForm" :model="WithdrawForm" status-icon label-position="left" label-width="100px"
                     style="width: 400px; margin-left:50px;">
                <el-form-item label="审核意见" prop="feedback">
                    <el-input type="textarea" :rows="3" v-model="WithdrawForm.feedback"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="WithdrawSuccess">提现通过</el-button>
                <el-button type="primary" @click="WithdrawFault">提现失败</el-button>
                <el-button @click="WithdrawDialogVisible = false">取消</el-button>
            </div>
        </el-dialog>


        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>

        <!-- 订单详情对话框 -->
        <el-dialog :visible.sync="orderDialogVisible" title="订单详情" width="800">

            <el-form :data="orderDetail" label-position="left">
                <el-form-item label="订单编号">
                    <span>{{ orderDetail.order.orderSn }}</span>
                </el-form-item>
                <el-form-item label="订单状态">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.order.orderStatus | orderStatusFilter }}</el-tag>
                    </template>
                </el-form-item>
                <el-form-item label="订单用户">
                    <span>{{ orderDetail.user.nickname }}</span>
                </el-form-item>
                <el-form-item label="用户留言">
                    <span>{{ orderDetail.order.message }}</span>
                </el-form-item>
                <el-form-item label="收货信息">
                    <span>（收货人）{{ orderDetail.order.consignee }}</span>
                    <span>（手机号）{{ orderDetail.order.mobile }}</span>
                    <span>（地址）{{ orderDetail.order.address }}</span>
                </el-form-item>
                <el-form-item label="商品信息">
                    <el-table :data="orderDetail.orderGoods" size="small" border fit highlight-current-row>
                        <el-table-column align="center" label="商品名称" prop="goodsName"/>
                        <el-table-column align="center" label="商品编号" prop="goodsSn"/>
                        <el-table-column align="center" label="货品规格" prop="specifications"/>
                        <el-table-column align="center" label="货品价格" prop="price"/>
                        <el-table-column align="center" label="货品数量" prop="number"/>
                        <el-table-column align="center" label="货品图片" prop="picUrl">
                            <template slot-scope="scope">
                                <img :src="scope.row.picUrl" width="40">
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="费用信息">
          <span>
            (实际费用){{ orderDetail.order.actualPrice }}元 =
            (商品总价){{ orderDetail.order.goodsPrice }}元 +
            (快递费用){{ orderDetail.order.freightPrice }}元 -
            (优惠减免){{ orderDetail.order.couponPrice }}元 -
            (宝宝币减免){{ orderDetail.order.integralPrice }}元
          </span>
                </el-form-item>
                <el-form-item label="支付信息">
                    <span>（支付渠道）微信支付</span>
                    <span>（支付时间）{{ orderDetail.order.payTime }}</span>
                </el-form-item>
                <el-form-item label="快递信息">
                    <span>（快递公司）{{ orderDetail.order.shipChannel }}</span>
                    <span>（快递单号）{{ orderDetail.order.shipSn }}</span>
                    <span>（发货时间）{{ orderDetail.order.shipTime }}</span>
                </el-form-item>
                <el-form-item label="收货信息">
                    <span>（确认收货时间）{{ orderDetail.order.confirmTime }}</span>
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
    import {listWithdraw, auditWithdraw, confirmWithdraw} from '@/api/withdraw'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import checkPermission from '@/utils/permission' // 权限判断函数
    import {handleDownload} from '@/utils/commen'
    const statusMap = {
        0: '平台待审核',
        1: '审核通过',
        2: '审核失败',
        3: '提现成功',
        4: '提现失败',
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
                    status: undefined,
                    sort: 'update_time',
                    order: 'desc',
                    beginTime:undefined,
                    endTime:undefined
                },
                statusMap,
                AuditDialogVisible: false,
                AuditForm: {
                    sn: undefined,
                    feedback: undefined,
                    result: undefined
                },
                WithdrawDialogVisible: false,
                WithdrawForm: {
                    sn: undefined,
                    feedback: undefined,
                    result: undefined
                },

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
                statusDic: ['平台待审核', '审核通过', '审核失败', '提现成功', '提现失败'],
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
                listWithdraw(this.listQuery).then(response => {
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
            //打开审核对话框
            handleAudit(row) {
                this.AuditDialogVisible = true
                this.AuditForm.sn = row.withdrawDepositApplySn
            },
            //审核通过
            AuditSuccess() {
                this.$refs['AuditForm'].validate((valid) => {
                    if (valid) {
                        this.AuditForm.result = 0
                        auditWithdraw(this.AuditForm).then(response => {
                            console.log(response)
                            this.AuditDialogVisible = false
                            this.AuditForm.feedback = ''
                            this.$notify.success({
                                title: '操作成功',
                                message: '审核通过'
                            })
                            this.getList()
                        }).catch(response => {
                            this.AuditDialogVisible = false
                            this.$notify.error({
                                title: '操作失败',
                                message: response.data.errmsg
                            })
                        })
                    }


                })
            },
            //审核不通过
            AuditFault() {
                this.$refs['AuditForm'].validate((valid) => {
                    if (valid) {
                        this.AuditForm.result = 1
                        console.log(this.AuditForm)
                        auditWithdraw(this.AuditForm).then(response => {
                            console.log(response)
                            this.AuditDialogVisible = false
                            this.AuditForm.feedback = ''
                            this.$notify.success({
                                title: '操作成功',
                                message: '审核失败'
                            })
                            this.getList()
                        }).catch(response => {
                            this.AuditDialogVisible = false
                            this.$notify.error({
                                title: '操作失败',
                                message: response.data.errmsg
                            })
                        })
                    }
                })
            },
//打开提现对话框
            handleWithdraw(row) {
                console.log(row.status)
                if (row.status == 2) {
                    this.$notify.error({
                        title: '操作失败',
                        message: '审核失败状态下无法提现！'
                    })
                } else {
                    this.WithdrawDialogVisible = true
                    this.WithdrawForm.sn = row.withdrawDepositApplySn
                }

            },
//提现通过
            WithdrawSuccess() {
                this.$refs['WithdrawForm'].validate((valid) => {
                    if (valid) {
                        this.WithdrawForm.result = 0
                        console.log(this.WithdrawForm)
                        confirmWithdraw(this.WithdrawForm).then(response => {
                            console.log(response)
                            this.WithdrawDialogVisible = false
                            this.WithdrawForm.feedback = ''
                            this.$notify.success({
                                title: '操作成功',
                                message: '提现通过'
                            })
                            this.getList()
                        }).catch(response => {
                            this.WithdrawDialogVisible = false
                            this.$notify.error({
                                title: '操作失败',
                                message: response.data.errmsg
                            })
                        })
                    }


                })
            },
//提现失败
            WithdrawFault() {
                this.$refs['AuditForm'].validate((valid) => {
                    if (valid) {
                        this.AuditForm.result = 1
                        console.log(this.AuditForm)
                        confirmWithdraw(this.AuditForm).then(response => {
                            console.log(response)
                            this.AuditDialogVisible = false
                            this.WithdrawForm.feedback = ''
                            this.$notify.success({
                                title: '操作成功',
                                message: '提现失败'
                            })
                            this.getList()
                        }).catch(response => {
                            this.WithdrawDialogVisible = false
                            this.$notify.error({
                                title: '操作失败',
                                message: response.data.errmsg
                            })
                        })
                    }
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.listQuery.beginTime=this.beginTime
                this.listQuery.endTime=this.endTime
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
                const tHeader = ['用户ID', '提现编号', '提现状态', '提现金额', '收款银行账户']
                const filterVal = ['userId', 'withdrawDepositApplySn', 'status', 'money', 'bankCardNo',]
                var downQuery=this.listQuery
                downQuery.limit=-1
                handleDownload(tHeader,filterVal,downQuery,'提现信息',listWithdraw)
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
