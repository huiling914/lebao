<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-input v-model="listQuery.actName" class="filter-item" placeholder="请输入活动名称" style="width:200px;"/>
			<el-input v-model="listQuery.orgName" class="filter-item" placeholder="请输入机构名称" style="width:200px;"/>
			
			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
		</div>
		<!--查询结果-->
		<div style="height: calc(100% - 155px);overflow: hidden">
			<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                <el-table-column align="center" label="团ID" prop="id"/>
                <el-table-column align="center" label="活动名称" prop="actName"/>
                <el-table-column align="center" label="机构名称" prop="orgName"/>

                <el-table-column align="center" label="团长ID" prop="userId"/>
                <el-table-column align="center" label="姓名" prop="realname"/>
                <el-table-column align="center" label="联系方式" prop="mobile"/>
                <el-table-column align="center" label="参团时间" prop="addTime"/>
                <el-table-column align="center" label="购买数量" prop="quantity"/>
                <el-table-column align="center" label="团购状态" prop="status">
                	<template slot-scope="scope">
                		<el-tag>{{status1[scope.row.status]}}</el-tag>
                	</template>
                </el-table-column>
                <el-table-column align="center" label="详情" width="150" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleInfo(scope.row)">查看
                        </el-button>
                        
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>
        <el-dialog title="详情" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
            <el-form ref="dataForm"  :model="dataForm" status-icon label-position="left"
                     label-width="100px" style="width: 620px; margin-left:50px;">
                <el-form-item label="活动名称" prop="actName">
                	<span>{{dataForm.actName}}</span>
                </el-form-item>
               
                <el-form-item label="机构名称" prop="orgName">
                	<span>{{dataForm.orgName}}</span>
                </el-form-item>
                <el-form-item label="商品名称" prop="objName">
                	<span>{{dataForm.objName}}</span>
                </el-form-item>
                <el-form-item label="商品类别" prop="objType">
                	<span>{{objType[dataForm.objType]}}</span>
                </el-form-item>
                <el-form-item v-if="dataForm.type" label="折扣类型" prop="type">
                	<span>{{types[dataForm.type]}}</span>
                </el-form-item>
                <el-form-item label="原价" prop="originalPrice">
                	<span>{{dataForm.originalPrice}}</span>
                </el-form-item>
                <el-form-item label="折扣价" prop="discountPrice">
                	<span>{{dataForm.discountPrice}}</span>
                </el-form-item>
                <el-form-item v-if="dataForm.founderPrice" label="团长折扣价" prop="founderPrice">
                	<span>{{dataForm.founderPrice}}</span>
                </el-form-item>
                <el-form-item v-if="dataForm.stockNum" label="库存数量" prop="stockNum">
                	<span>{{dataForm.stockNum}}</span>
                </el-form-item>
                <el-form-item label="已售数量" prop="soldNum">
                	<span>{{dataForm.soldNum}}</span>
                </el-form-item>
                
                <el-form-item v-if="dataForm.startTime" label="开始时间" prop="startTime">
                	<span>{{dataForm.startTime}}</span>
                </el-form-item>
                <el-form-item v-if="dataForm.endTime" label="结束时间" prop="endTime">
                	<span>{{dataForm.endTime}}</span>
                </el-form-item>
                <el-form-item label="单人限购数量" prop="userLimit">
                	<span>{{dataForm.userLimit}}</span>
                </el-form-item>
                <el-form-item label="成团人数" prop="requireNum">
                	<span>{{dataForm.requireNum}}</span>
                </el-form-item>
                <el-form-item label="团购有效期" prop="expireMinute">
                	<span>{{dataForm.expireMinute}}(分钟)</span>
                </el-form-item>
                <el-form-item label="团员信息" prop="follows">
                	<el-table  :data="dataForm.follows" size="small"  border fit
                      highlight-current-row height="100%" width="400px">
                      
                      <el-table-column align="center" label="姓名" prop="realname"/>
                      <el-table-column align="center" label="联系方式" prop="mobile"/>
                      <el-table-column align="center" label="参团时间" prop="addTime"/>
                      <el-table-column align="center" label="购买数量" prop="quantity"/>
                      <el-table-column align="center" label="团购状态" prop="status">
                	     <template slot-scope="scope">
                		     <el-tag>{{status2[scope.row.status]}}</el-tag>
                	     </template>
                      </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            
        </el-dialog>

	</div>
</template>
<script>
	import Pagination from '@/components/Pagination'
	import {listGroupon,readGroupon} from '@/api/groupon'
	export default{
		components:{Pagination},
		name:'groupList',
		data(){
			return{
				list:[],
				total:0,
				listLoading:false,
				listQuery:{
					actName:undefined,
					orgName:undefined,
					actId:undefined,
					limit:10,
					page:1,
					sort:'update_time',
					order:'desc'
				},
				status1:['发起中','发起成功','发起失败','拼团成功','拼团失败'],
                status2:['参团中','参团成功','参团失败','拼团成功','拼团失败'],
				dialogFormVisible:false,
				types:['普通拼团折扣','团长减免'],
				objType:['录播课程','线下课程','商品'],
				dataForm:{}
			}
		},
		created(){
			this.listQuery.actId=this.$route.params.actId
			this.getList()
		},
		methods:{
			getList(){
				this.listLoading=true
				listGroupon(this.listQuery).then((res)=>{
					if(res.data.errno==0){
						this.list=res.data.data.items
					    this.total=res.data.data.total
					    this.listLoading=false
					}else{
						this.list=[]
						this.total=0
						this.listLoading=false
					}
					
				}).catch((err)=>{
					this.list=[]
					this.total=0
					this.listLoading=false
				})

			},
			handleFilter(){
				this.getList()
			},
			handleInfo(row){
				this.dialogFormVisible=true
				readGroupon(row.id).then((res)=>{
					this.dataForm=res.data.data
				})
			}
		}
	}
</script>
<style scope>

</style>