<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-date-picker v-model="listQuery.beginTime" class="filter-item" clearable type="date" value-format="yyyyMMdd" align="right" placeholder="起始日期"/><span class="filter-item">&nbsp;至</span>
            <el-date-picker v-model="listQuery.endTime" class="filter-item" clearable type="date" value-format="yyyyMMdd" align="right" placeholder="结束日期"/>
            <!-- <el-date-picker v-model="value" class="filter-item" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="起始日期" end-placeholder="结束日期" value-format="yyyyMMdd" @change="timeChange"/> -->
            <el-input v-model="listQuery.user" clearable class="filter-item" style="width: 200px;"
                      placeholder="请输入用户ID"/>
            <el-input v-model="listQuery.sn" clearable class="filter-item" style="width: 200px;" placeholder="请输入订单编号"/>
            <el-select v-model="listQuery.status" clearable style="width: 200px" class="filter-item"
                       placeholder="请选择订单状态">
                <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value"/>
            </el-select>
            <el-button v-permission="['GET /admin/order/list']" class="filter-item" type="primary" icon="el-icon-search"
                       @click="handleFilter">查找
            </el-button>
            <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                       @click="handleDownload">导出
            </el-button>
        </div>

        <!-- 查询结果 -->
        <div style="height: calc(100% - 155px);overflow: hidden">
            <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">

                <el-table-column align="center" min-width="200" label="订单编号" prop="sn"/>

                <el-table-column align="center" min-width="50" label="用户ID" prop="userId"/>

                <el-table-column align="center" label="学校名称" min-width="150" prop="orgName"/>


                <el-table-column align="center" label="订单状态" min-width="120" prop="orderStatus">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.orderStatus | orderStatusFilter }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="订单金额" prop="orderPrice"/>

                <el-table-column align="center" label="实付金额" prop="actualAmount"/>

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
        <el-dialog :visible.sync="orderDialogVisible" :close-on-click-modal="false" title="订单详情" width="800">

            <el-form :data="orderDetail" label-position="left">
                <el-form-item label="订单编号">
                    <span>{{ orderDetail.sn }}</span>
                </el-form-item>
                <el-form-item label="用户ID">
                    <span>{{ orderDetail.userId }}</span>
                </el-form-item>
                
                <el-form-item label="学校名称">
                    <span>{{ orderDetail.orgName }}</span>
                </el-form-item>
                <el-form-item label="课程名称">
                    <span>{{ orderDetail.courseName }}</span>
                </el-form-item>
                
                <el-form-item label="订单金额">
                    <span>{{ orderDetail.orderPrice }}</span>
                </el-form-item>
                <el-form-item v-if="orderDetail.balanceAmount" label="余额支付">
                    <span>{{ orderDetail.balanceAmount }}</span>
                </el-form-item>
                <el-form-item v-if="orderDetail.vouchersAmount" label="宝宝币减免">
                    <span>{{ orderDetail.vouchersAmount }}</span>
                </el-form-item>
                

                <el-form-item v-if="orderDetail.couponAmount" label="优惠减免">
                    <span>{{ orderDetail.couponAmount }}</span>
                </el-form-item>
                
                
                <el-form-item label="实际支付">
                    <span>{{ orderDetail.actualAmount }}</span>
                </el-form-item>
                <el-form-item label="订单状态">
                    <span> {{orderDetail.orderStatus | orderStatusFilter }}</span>
                </el-form-item>
                <el-form-item label="是否拼团">
                    <span><el-tag>{{isGroup[orderDetail.groupStatus]}}</el-tag></span>
                </el-form-item>
                <el-form-item label="团购身份" v-if="orderDetail.groupStatus">
                    <span><el-tag>{{groupRole[orderDetail.groupRole]}}</el-tag></span>
                </el-form-item>
                <el-form-item label="团购活动ID" v-if="orderDetail.groupStatus">
                    <span>{{orderDetail.groupActivityId}}</span>
                </el-form-item>
                <el-form-item label="团ID" v-if="orderDetail.groupStatus">
                    <span>{{orderDetail.groupId}}</span>
                </el-form-item>
                <el-form-item label="参团ID" v-if="orderDetail.groupStatus">
                    <span>{{orderDetail.groupFollowId}}</span>
                </el-form-item>
                <el-form-item label="支付类型">
                    <span><el-tag>{{payType[orderDetail.payType]}}</el-tag></span>
                </el-form-item>
                <el-form-item label="下单时间">
                    <span>{{ orderDetail.addTime }}</span>
                </el-form-item>
                <el-form-item label="最近更新时间">
                    <span>{{ orderDetail.updateTime }}</span>
                </el-form-item>
                <el-form-item label="学生信息">

                    <el-table v-if="orderDetail.items" v-loading="stulistLoading" :data="orderDetail.items" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                      <el-table-column align="center" label="学生ID" prop="stuId"/>
                      <el-table-column align="center" label="学生姓名" prop="stuName"/>
                      <el-table-column align="center" label="学生性别" prop="stuGender">
                        <template slot-scope="scope">
                            <el-tag>{{ gender[scope.row.stuGender] }}</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="学生生日" prop="stuBirthday"/>
                      <el-table-column align="center" label="联系方式" prop="mobile"/>

                    </el-table>
                    <span v-else>暂无学生信息</span>
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
    import {listOrder, shipOrder, refundOrder, detailOrder,detailSchoolOrder} from '@/api/order'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import checkPermission from '@/utils/permission' // 权限判断函数
    import {handleDownload} from '@/utils/commen'
    const statusMap = {
        0: '待支付',
        1: '已取消',
        2: '已支付',
        3: '支付失败',
        4: '已评价',
        5: '退款中',
        6: '已退款',
        7: '退款失败',
        8: '已完成'

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
                isGroup:['否','是'],
                groupRole:['团长','参团'],
                payType:['待定','余额','小程序'],
                list: undefined,
                total: 0,
                listLoading: true,
                stulistLoading:true,
                value:undefined,
                listQuery: {
                    user: undefined,    // 用户id
                    //brand: undefined,    // 商户id
                    sn: "",
                    //type: 1,    // 订单类型, 0-商户, 1-学校
                    status: undefined,    // 订单状态
                    page: 1,    // 页数
                    limit: 20,    // 每页容量
                    beginTime:undefined,
                    endTime:undefined,
                    sort: "update_time",    // 排序字段
                    order: "desc",    // 排序规则
                },
                statusMap,
                gender:['女','男'],
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
                    details:undefined


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
          'listQuery.beginTime':function(val,oldVal){
            if(!val){
              this.getList()
            }
          },
          'listQuery.endTime':function(val,oldVal){
            if(!val){
              this.getList()
            }
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
                detailOrder(row.id).then((res)=>{
                    this.stulistLoading=true
                    this.orderDetail=res.data.data
                    this.stulistLoading=false
                }).catch((err)=>{
                    console.log(err)
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
            timeChange(){
                if(this.value){
                    this.listQuery.beginTime=this.value[0]
                    this.listQuery.endTime=this.value[1]
                }else{
                    this.listQuery.beginTime=undefined
                    this.listQuery.endTime=undefined
                }
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
                const tHeader = ['订单编号', '用户ID', '学校名称', '订单状态', '订单金额', '实付金额', '下单时间', '最近更新时间']
                const filterVal = ['sn', 'userId', 'orgName', 'orderStatus', 'orderAmount', 'actualAmount', 'addTime', 'updateTime']
                var downQuery=this.listQuery
                downQuery.limit=-1
                handleDownload(tHeader,filterVal,downQuery,'学校订单信息',listOrder)
                this.downloadLoading=false
            }
        }
    }
</script>
