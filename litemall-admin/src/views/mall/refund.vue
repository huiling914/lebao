<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;"
                      placeholder="请输入用户ID"/>
            <el-input v-model="listQuery.refundSn" clearable class="filter-item" style="width: 200px;"
                      placeholder="请输入退款编号"/>
            <!-- <el-select v-model="listQuery.orderStatusArray" multiple style="width: 200px" class="filter-item" placeholder="请选择订单状态"> -->
            <el-select v-model="orderStatus" clearable style="width: 200px" class="filter-item"
                       placeholder="请选择订单状态">
                <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value"/>
            </el-select>
            <el-button v-permission="['GET /admin/order/list']" class="filter-item" type="primary" icon="el-icon-search"
                       @click="handleFilter">查找
            </el-button>
            <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
        </div>

        <!-- 查询结果 -->
        <div style="height: calc(100% - 155px);overflow: hidden">
            <el-table v-loading="listLoading" :data="refundList" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">

                <el-table-column align="center" min-width="100" label="退款编号" prop="refundSn"/>

                <el-table-column align="center" label="用户ID" prop="userId"/>

                <el-table-column align="center" label="订单退款状态" prop="status">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.status | orderStatusFilter }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="商家/学校名称" prop="brandName"/>

                <el-table-column align="center" label="订单类型" prop="type"/>

                <el-table-column align="center" label="退款余额" prop="balancePrice"/>
                <el-table-column align="center" label="退款宝宝币" prop="vouchersPrice"/>

                <el-table-column align="center" label="申请退款原因" prop="reason"/>

                <el-table-column align="center" label="审核时间" prop="merchantReviewTime"/>

                <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <!-- <el-button v-permission="['GET /admin/order/detail']" type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
                        <el-button v-permission="['POST /admin/order/ship']" v-if="scope.row.orderStatus==201" type="primary" size="mini" @click="handleShip(scope.row)">发货</el-button>
                        <el-button v-permission="['POST /admin/order/refund']" v-if="scope.row.orderStatus==202" type="primary" size="mini" @click="handleRefund(scope.row)">退款</el-button> -->
                        <el-button v-if="scope.row.status==0"  v-permission="['GET /admin/order/detail']" type="primary" size="mini"
                                   @click="toOpinion(scope.row.id)">操作
                        </el-button>
                        <el-button v-else v-permission="['GET /admin/order/detail']" type="primary" size="mini"
                                   @click="noOperate" >操作
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getRefundList"/>
        <!--审核对话框-->
        <el-dialog :visible.sync="opinionDialogVisible" :title="审核" :close-on-click-modal="false" width="700">
            <el-form ref="refundForm" :model="refundForm" status-icon label-position="left" label-width="100px"
                     style="width: 400px; margin-left:50px;">
                <el-form-item label="审核意见" prop="refundMoney">
                    <el-input v-model="feedback.feedback"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="toPass">通过</el-button>
                <el-button @click="toRefuse">拒绝</el-button>

            </div>
        </el-dialog>

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
    import {listOrder, shipOrder, refundOrder, detailOrder, refundList, feedBack} from '@/api/order'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import checkPermission from '@/utils/permission' // 权限判断函数
    import {handleDownload} from '@/utils/commen'
    const statusMap = {

        0: '待审核',
        1: '审核通过，待平台审核',
        2: '商家拒绝'

    }

    export default {
        name: 'Refund',
        components: {Pagination},
        filters: {
            orderStatusFilter(status) {
                return statusMap[status]
            }
        },
        watch:{
          'listQuery.userId':function(val,oldVal){
            if(!val){
              this.getRefundList()
            }
          },
          'listQuery.refundSn':function(val,oldVal){
            if(!val){
              this.getRefundList()
            }
          },
          'orderStatus':function(val,oldVal){
            if(!val){
              this.getRefundList()
            }
          }


        },
        data() {
            return {
                refundList: undefined,
                total: 0,

                listLoading: true,
                orderStatus:undefined,
                listQuery: {
                    page: 1,
                    limit: 20,
                    sort: 'apply_time',
                    order: 'desc',
                    userId: undefined,
                    refundSn: undefined,
                    status: undefined,
                    //status1:undefined,
                    type: 0

                },
                feedback: {
                    type: 0,
                    refundApplyId: undefined,
                    feedback: undefined,
                    reviewResult: undefined

                },
                statusMap,
                orderDialogVisible: false,
                opinionDialogVisible: false,
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
                downloadLoading: false
            }
        },
        created() {
            this.getRefundList()
        },
        methods: {
            checkPermission,

            getRefundList() {
                this.listLoading = true
                if(this.orderStatus){
                    this.listQuery.status=this.orderStatus
                }else{
                    this.listQuery.status='0,1,2'
                }
                refundList(this.listQuery).then(response => {
                    console.log(response)
                    this.refundList = response.data.data.items
                    for (var i = 0; i < this.refundList.length; i++) {
                        this.refundList[i].type = this.getType(this.refundList[i].type);
                        //this.refundList[i].status=this.getStatus(this.refundList[i].status);
                    }
                    console.log(this.refundList)
                    this.total = response.data.data.total
                    this.listLoading = false
                }).catch(() => {
                    this.list = []
                    this.total = 0
                    this.listLoading = false
                })
            },
            noOperate(){
                this.$message.error('该订单已审核，请勿重复操作');
            },
            toOpinion(id) {

                this.opinionDialogVisible = true
                this.feedback.refundApplyId = id
                console.log(this.feedback)
                this.feedback.feedback = undefined
            },
            toPass() {
                this.feedback.reviewResult = 0
                console.log('aa')
                feedBack(this.feedback).then(response => {
                    this.getRefundList()
                    this.opinionDialogVisible = false
                    this.$notify.success({
                        title: '成功',
                        message: '审核成功'
                    })
                    console.log(response)
                }).catch((error) => {
                    console.log(error)
                })

            },
            toRefuse() {
                this.feedback.reviewResult = 1

                feedBack(this.feedback).then((response) => {
                    this.getRefundList()
                    this.opinionDialogVisible = false
                    this.$notify.success({
                        title: '成功',
                        message: '审核成功'
                    })
                    console.log(response)
                }).catch((error) => {

                })

            },
            handleFilter() {
                this.listQuery.page = 1
                //console.log('aa')
                //console.log(this.listQuery)
                this.getRefundList()
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
            getType(type) {
                if (type == 0) {
                    return '商家';
                } else {
                    return '学校'
                }
            },
            getStatus(status) {
                if (status == 0) {
                    return '商家审核中';
                } else if (status == 1) {
                    return '商家审核通过';
                } else if (status == 2) {
                    return '商家拒绝';
                } else if (status == 3) {
                    return '平台审核中';
                } else if (status == 4) {
                    return '平台审核通过';
                } else if (status == 5) {
                    return '平台拒绝';
                } else if (status == 6) {
                    return '退款中';
                } else if (status == 7) {
                    return '退款完成';
                } else if (status == 8) {
                    return '退款失败';
                }
            },
            handleDownload() {
                this.downloadLoading = true
                const tHeader = ['退款编号','用户ID', '订单退款状态', '商家/学校名称', '订单类型', '退款余额', '退款宝宝币','申请退款原因','审核时间']
                const filterVal = ['refundSn', 'userId', 'status', 'brandName', 'type', 'balancePrice', 'vouchersPrice', 'reason','platformReviewTime']
                var downQuery=this.listQuery
                downQuery.limit=-1
                handleDownload(tHeader,filterVal,downQuery,'商家退款信息',refundList)
                    this.downloadLoading=false
                
            }        
        }
    }
</script>
