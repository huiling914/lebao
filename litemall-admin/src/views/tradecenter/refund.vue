<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.user" clearable class="filter-item" style="width: 200px;"
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

                <el-table-column align="center" min-width="100" label="退款编号" prop="sn"/>

                <el-table-column align="center" label="用户ID" prop="userId"/>

                <el-table-column align="center" label="订单退款状态" prop="status">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.refundStatus | orderStatusFilter }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="学校名称" prop="orgName"/>

                <el-table-column align="center" label="课程名称" prop="courseName"/>

                <el-table-column align="center" label="退款余额" prop="balance"/>
                <el-table-column align="center" label="退款宝宝币" prop="vouchers"/>

                <!-- <el-table-column align="center" label="申请退款原因" prop="reason"/> -->

                <!-- <el-table-column align="center" label="审核时间" prop="merchantReviewTime"/> -->

                <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <!-- <el-button v-permission="['GET /admin/order/detail']" type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
                        <el-button v-permission="['POST /admin/order/ship']" v-if="scope.row.orderStatus==201" type="primary" size="mini" @click="handleShip(scope.row)">发货</el-button>
                        <el-button v-permission="['POST /admin/order/refund']" v-if="scope.row.orderStatus==202" type="primary" size="mini" @click="handleRefund(scope.row)">退款</el-button> -->
                        <el-button  v-permission="['GET /admin/order/detail']" type="primary" size="mini"
                                   @click="handleAudit(scope.row.id)">审核
                        </el-button>
                        
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getRefundList"/>
        <!--审核对话框-->
        <el-dialog :visible.sync="opinionDialogVisible" title="审核" :close-on-click-modal="false" width="700">
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

        <!-- 退款详情对话框 -->
        <el-dialog :visible.sync="refundVisible" title="退款详情" width="800">

            <el-form :data="refundForm" label-position="left">
                <el-form-item label="退款单号">
                    <span>{{ refundForm.sn }}</span>
                </el-form-item>
                <el-form-item label="用户ID">
                    <span>{{ refundForm.userId }}</span>
                </el-form-item>
                <el-form-item label="订单ID">
                    <span>{{ refundForm.orderId }}</span>
                </el-form-item>
                <el-form-item label="订单单号">
                    <span>{{ refundForm.orderSn }}</span>
                </el-form-item>
                <el-form-item label="学校名称">
                    <span>{{ refundForm.orgName }}</span>
                </el-form-item>
                <el-form-item label="课程名称">
                    <span>{{ refundForm.courseName }}</span>
                </el-form-item>
                <el-form-item label="退款金额">
                    <span>{{ refundForm.balance }}</span>
                </el-form-item>
                <el-form-item label="退款宝宝币" v-if="refundForm.vouchers">
                    <span>{{ refundForm.vouchers }}</span>
                </el-form-item>
                <el-form-item label="申请时间">
                    <span>{{ refundForm.applyTime }}</span>
                </el-form-item>
                <el-form-item label="退款宝宝币" v-if="refundForm.vouchers">
                    <span>{{ refundForm.vouchers }}</span>
                </el-form-item>
                <el-form-item label="学校审核状态">
                    <span><el-tag>{{auditResult[refundForm.auditResult]}}</el-tag></span>
                </el-form-item>
                <el-form-item label="学校反馈" v-if="refundForm.auditFeedback">
                    <span>{{ refundForm.auditFeedback }}</span>
                    
                </el-form-item>
                <el-form-item label="学校审核人" v-if="refundForm.auditAdminId">
                    <span>{{ refundForm.auditAdminId }}</span>                   
                </el-form-item>
                <el-form-item label="学校审核时间" v-if="refundForm.auditTime">
                    <span>{{ refundForm.auditTime }}</span>                   
                </el-form-item>
                <el-form-item label="平台审核状态">
                    <span><el-tag>{{confirmResult[refundForm.confirmResult]}}</el-tag></span>
                </el-form-item>
                <el-form-item label="审核结果" v-if="!refundForm.confirmResult">
                    <el-select v-model="auFeedback.result">
                        <el-option v-for="(audit,index) in audit" :key="audit.id" :value="audit.id" :label="audit.result"/>
                        
                    </el-select>
                </el-form-item>
                <el-form-item label="审核意见" v-if="!refundForm.confirmResult">
                    <el-input type="textarea" :rows="4" v-model="auFeedback.feedback"/> 
                </el-form-item>
                <el-form-item label="平台审核意见" v-if="refundForm.confirmFeedback">
                    <span>{{ refundForm.confirmFeedback }}</span>    
                </el-form-item>
                <el-form-item label="平台审核时间" v-if="refundForm.confirmTime">
                    <span>{{ refundForm.confirmTime }}</span>    
                </el-form-item>
                <el-form-item label="平台审核人" v-if="refundForm.confirmAdminName">
                    <span>{{ refundForm.confirmAdminName }}</span>    
                </el-form-item>
                <el-form-item label="是否到账" v-if="refundForm.accountStatus">
                    <span><el-tag>{{ accountStatus[refundForm.accountStatus] }}</el-tag></span>    
                </el-form-item>

                
            </el-form>
            <div slot="footer" class="dialog-footer">

                <el-button @click="refundVisible = false">取消</el-button>
                <el-button :loading="auditLoading" v-if="!refundForm.confirmResult" type="primary" @click="auditRefund">审核</el-button>
                <el-button  v-else type="primary" @click="refundVisible = false">确定</el-button>
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
    import {listOrder, shipOrder, refundOrder, detailOrder, refundList, detailRefund,feedBack,confirmRefund} from '@/api/order'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import checkPermission from '@/utils/permission' // 权限判断函数
    import {handleDownload} from '@/utils/commen'
    const statusMap = {

        
        2: '学校通过，待审核',
        4: '平台通过',
        5: '平台拒绝'

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
          'listQuery.user':function(val,oldVal){
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
                auditResult:['待审核','学校通过','学校拒绝'],
                confirmResult:['待审核','平台通过','平台拒绝'],
                audit:[{id:1,result:'通过'},{id:2,result:'拒绝'}],
                accountStatus:['未到账','已到账'],
                auFeedback:{
                    id:undefined,
                    feedback:undefined,
                    result:undefined
                },
                refundForm:undefined,
                refundList: undefined,
                total: 0,
                refundVisible:false,
                orderStatus:undefined,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    sort: 'apply_time',
                    order: 'desc',
                    user: undefined,
                    refundSn: undefined,
                    refundStatus: '2,4,5',
                    
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
                    this.listQuery.refundStatus=this.orderStatus
                }else{
                    this.listQuery.refundStatus='2,4,5'
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

            toOpinion(id) {

                this.opinionDialogVisible = true
                this.feedback.refundApplyId = id
                console.log(this.feedback)
                this.feedback.feedback = undefined
            },
            toPass() {
                this.feedback.reviewResult = 0

                feedBack(this.feedback).then(response => {
                    this.opinionDialogVisible = false
                    this.getRefundList()

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
                    this.opinionDialogVisible = false
                    this.getRefundList()

                    this.$notify.success({
                        title: '成功',
                        message: '审核成功'
                    })
                    console.log(response)
                }).catch((error) => {

                })

            },
            noOperate(){
                this.$message.error('该订单已审核，请勿重复操作');
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
            handleAudit(id){
                this.refundVisible=true
                this.auFeedback.id=undefined
                this.auFeedback.result=undefined
                this.auFeedback.feedback=undefined
                this.auditLoading=false
                detailRefund(id).then((res)=>{
                    this.refundForm=res.data.data
                })
            },
            auditRefund(){
                this.auFeedback.id=this.refundForm.id
                this.auditLoading=true
                if(this.auFeedback.result==undefined){
                    this.auditLoading=false
                    this.$message({
                        message:'请选择审核结果',
                        type:'warning'
                    })
                }else if(!this.auFeedback.feedback){
                    this.auditLoading=false
                    this.$message({
                        message:'请填写审核意见',
                        type:'warning'
                    })
                }else{
                    confirmRefund(this.auFeedback).then((res)=>{
                        this.auditLoading=false
                        this.getRefundList()
                        this.refundVisible=false
                        this.$notify.success({
                            title:'成功',
                            message:'审核成功'
                        })
                    }).catch((err)=>{
                        this.auditLoading=false
                        this.$notify.error({
                            title:'失败',
                            message:err.data.errmsg
                        })
                    })
                }
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
                    return '学校审核中';
                } else if (status == 1) {
                    return '学校审核通过';
                } else if (status == 2) {
                    return '学校拒绝';
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
                    const tHeader = ['退款编号', '用户ID', '学校名称','课程名称', '退款余额', '退款宝宝币','学校审核状态','学校审核意见','学校审核时间','学校审核人员','平台审核状态','平台审核意见','平台审核时间','平台审核人员']
                    const filterVal = ['sn', 'userId', 'orgName', 'courseName', 'type', 'balance', 'vouchers', 'auditResult','auditFeedback','auditTime','auditAdminId','confirmResult','confirmFeedback','confirmTime','confirmAdminName']
                    var downQuery=this.listQuery
                    downQuery.limit=-1
                    handleDownload(tHeader,filterVal,downQuery,'学校退款信息',refundList)
                    this.downloadLoading=false
            }
        }
    }
</script>
