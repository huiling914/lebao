<template>
	<div class="app-container">
		<!--查询和其他操作-->
		<div class="filter-container">
			<el-input v-model="listQuery.schoolName" clearable class="filter-item" style="width:200px;" placeholder="请输入学校名称" />
			<el-date-picker v-model="listQuery.startTime" type="datetime" class="filter-item" clearable value-format="yyyy-MM-dd HH:mm:ss" align="right" placeholder="起始日期"/><span class="filter-item">&nbsp;至</span>
            <el-date-picker v-model="listQuery.endTime" type="datetime" class="filter-item" clearable  value-format="yyyy-MM-dd HH:mm:ss" align="right" placeholder="结束日期"/>
            <el-button class="filter-item" type="primary" icon="el-icon-search"  @click="handleFilter">查找
            </el-button>
            <el-button  class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加
            </el-button>
            <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
            
		</div>
		<!--查询结果-->
		<div style="height: calc(100% - 155px);overflow: hidden">
			<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row height="100%">
                <el-table-column align="center" label="学校名称" prop="schoolName"/>
                <el-table-column align="center" label="打卡地址" prop="clockAddress" />
                <el-table-column align="center" label="服务日期" prop="volunDate" />
                <el-table-column align="center" label="服务时间" prop="volunTime" />
                <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button v-permission="['POST /admin/school/update']" type="primary" size="mini"
                                   @click="handleUpdate(scope.row)">编辑
                        </el-button>
                        <el-button v-permission="['POST /admin/school/delete']" type="danger" size="mini"
                                   @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

		</div>
		<!--增加/编辑对话框-->
		<el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" :close-on-click-modal="false" :top="'0'">
			<el-form ref="dataForm"  :rules="rules" :model="dataForm" status-icon label-position="left"
                     label-width="120px" style="width: 400px; margin-left:50px;">
                     <el-form-item label="学校名称" prop="schoolInfo">
                     	<el-select v-model="dataForm.schoolInfo" clearable   class="filter-item" filterable  remote placeholder="请输入学校名称" :remote-method="getSchools" :loading="loading">
                            <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"/>
                     </el-select>
                     </el-form-item>
                     <el-form-item label="打卡地址" prop="clockAddress">
                     	<el-input id="suggestId" @focus="focus" class="filter-item" v-model="dataForm.clockAddress"/>
                     </el-form-item>
                     <el-form-item label="活动开始日期" prop="startDate">
                     	<el-date-picker v-model="dataForm.startDate" type="date" class="filter-item" clearable value-format="yyyy-MM-dd" align="right" placeholder="活动开始日期"/>
                     </el-form-item>
                     <el-form-item label="活动结束日期" prop="endDate">
                     	<el-date-picker v-model="dataForm.endDate" type="date" class="filter-item" clearable value-format="yyyy-MM-dd" align="right" placeholder="活动结束日期"/>
                     </el-form-item>
                     <el-form-item label="活动开始时间" prop="startTimeVo">
                     	<el-time-picker v-model="dataForm.startTimeVo" :picker-options="{selectableRange: '00:00:00 - 23:59:59'}" class="filter-item" clearable value-format="HH:mm:ss" align="right" placeholder="活动开始时间"/>
                     </el-form-item>
                     <el-form-item label="活动结束时间" prop="endTimeVo">
                     	<el-time-picker v-model="dataForm.endTimeVo" :picker-options="{selectableRange: '00:00:00 - 23:59:59'}" class="filter-item" clearable value-format="HH:mm:ss" align="right" placeholder="活动结束时间"/>
                     </el-form-item>
            </el-form>
            <div class="bmap" id="bmap"></div>
            <div slot="footer" class="dialog-footer">

                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="addVoluntary">确定</el-button>
                <el-button v-else type="primary" @click="updateVoluntary">确定</el-button>
            </div>
		</el-dialog>

		
	</div>
</template>
<script>
	import Pagination from '@/components/Pagination'
	import { listVoluntary,addVoluntary,updateVoluntary,deleteVoluntary } from '@/api/voluntary'
	import {listSchool} from '@/api/school'
	export default{
		name:'Voluntary',
		components: {Pagination},
		data(){
			return{
				list:undefined,
				total:0,
				listLoading:false,//表格
                downloadLoading:false,//导出
                loading:false,//远程查询
				dialogFormVisible:false,
				dialogStatus: '',
				schools:[],
							
				startTime:undefined,
				endTime:undefined,
				textMap: {
                    update: '编辑',
                    create: '创建'
                },
				listQuery:{
					schoolName:undefined,
					startTime:undefined,
					endTime:undefined,
					limit:20,
					page:1,
					sort:"update_time",
					order:"desc"


				},
				findSchool:{
					limit:20,
					name:undefined
				},
				dataForm:{
					schoolId:undefined,
					schoolName:undefined,
					clockAddress:undefined,
					startTime:undefined,
					endTime:undefined,
					longitude: undefined,
                    latitude: undefined,
                    schoolInfo:undefined,
                    startDate:undefined,
                    endDate:undefined,
                    startTimeVo:undefined,
                    endTimeVo:undefined, 
				},
				deleted:{
					ids:undefined
				},
                rules:{
                    schoolInfo:[
                        {required: true, message: '学校名称不能为空', trigger: 'blur'}
                    ],
                    clockAddress:[
                        {required: true, message: '打卡不能为空', trigger: 'blur'}
                    ],
                    startDate:[
                        {required: true, message: '活动开始日期不能为空', trigger: 'blur'}
                    ],
                    endDate:[
                        {required: true, message: '活动结束日期不能为空', trigger: 'blur'},
                        //{validator:this.validateEnd,trigger:'blur'}
                        {validator:this.validateDate,trigger:'blur'}

                    ],
                    startTimeVo:[
                        {required: true, message: '活动开始时间不能为空', trigger: 'blur'}
                    ],
                    endTimeVo:[
                        {required: true, message: '活动结束时间不能为空', trigger: 'blur'},
                        {validator:this.validateTime,trigger:'blur'}

                    ],
                }
			}
		},
		created(){
			this.getList()
			//this.getSchoolList()
		},
		watch:{
          'listQuery.schoolName':function(val,oldVal){
            if(!val){
              this.getList()
            }
          },
          'listQuery.startTime':function(val,oldVal){
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
		methods:{

			getList(){
				listVoluntary(this.listQuery).then((res)=>{
					this.listLoading=true
					this.list=res.data.data.items
                    console.log(this.list)
					for(var i=0;i<this.list.length;i++){
						//var start=this.list[i].startTime.split(/\s+/)
						//var end=this.list[i].endTime.split(/\s+/)
						this.list[i].volunDate=this.list[i].startDate+"--"+this.list[i].endDate

						this.list[i].volunTime=this.list[i].startTimeVo+"--"+this.list[i].endTimeVo
                        //console.log(this.list[i])
                        // this.list[i].startDate=this.list[i].volunDate.split("--")[0]
                        // this.list[i].endDate=this.list[i].volunDate.split("--")[1]
                        // this.list[i].startTime1=this.list[i].volunTime.split("--")[0]
                        // this.list[i].endTime1=this.list[i].volunTime.split("--")[1]
                        this.list[i].schoolInfo=this.list[i].schoolName
					}
                    //console.log(this.list)
					this.total=res.data.data.total
					this.listLoading=false
				}).catch((err)=>{
					this.listLoading=false
					this.list=[]
					this.total=0
				})
			},
			getSchools(query){
                //console.log(query);
                if(query){
                    this.loading=true;
                    
                    this.findSchool.name=query;
                    console.log(this.findSchool)
                    setTimeout(()=>{
                        this.loading=false;
                        listSchool(this.findSchool).then((response)=>{
                            this.schools=[]
                            var schoollist=response.data.data.items;
                            for(var i=0;i<schoollist.length;i++){
                                this.schools.push({id:schoollist[i].id,name:schoollist[i].name+" "+schoollist[i].address})
                            }
                            // this.schools=response.data.data.items.map(item=>{
                            //     return {value: item.id, label: item.name};
                            // })
                            console.log(this.schools)
                            
                        }).catch((error)=>{
                            console.log(error);
                        })

                    },200)
                }else{
                    this.schools=[];
                }


            },
			handleFilter(){
				this.getList()
			},
			resetForm(){
				this.dataForm={
                    schoolInfo:undefined,
					schoolId:undefined,
					schoolName:undefined,
					clockAddress:undefined,
					startTime:undefined,
					endTime:undefined,
					longitude: undefined,
                    latitude: undefined,
                    
                    startDate:undefined,
                    endDate:undefined,
                    startTimeVo:undefined,
                    endTimeVo:undefined,     

				}
			},
			handleCreate(){
				this.dialogStatus="create"
				this.dialogFormVisible=true
				this.resetForm()
				// this.schoolInfo=undefined
				// this.startDate=undefined
				// this.endDate=undefined
				// this.startTime=undefined
				// this.endTime=undefined
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
				
			},
            validateEnd(start,end){
                if(start>=end){
                    return false
                }else{
                    return true
                }
            },
            validateDate(rule,value,callback){
                if(value<=this.dataForm.startDate){
                    return callback(new Error('结束日期需晚于开始日期'));
                }else{
                    callback()
                }
                
            },
            validateTime(rule,value,callback){
                if(value<=this.dataForm.startTimeVo){
                    return callback(new Error('结束时间需晚于开始时间'));
                }else{
                    callback()
                }
            },
			addVoluntary(){
				this.dataForm.schoolId=this.dataForm.schoolInfo
				this.dataForm.startTime=this.dataForm.startDate+" "+this.dataForm.startTimeVo
                this.dataForm.endTime=this.dataForm.endDate+" "+this.dataForm.endTimeVo
				for(var i=0;i<this.schools.length;i++){
					if(this.schools[i].id=this.dataForm.schoolId){
						this.dataForm.schoolName=this.schools[i].name.split(/\s+/)[0]
					}
				}
                if(!this.dataForm.schoolId){
                    this.$message.error('请输入学校名称！');
                }else if(!this.dataForm.clockAddress){
                    this.$message.error('请输入打卡地址！');
                }else if(!this.dataForm.startDate){
                    this.$message.error('请输入活动开始日期！');
                }else if(!this.dataForm.endDate){
                    this.$message.error('请输入活动结束日期！');
                }else if(this.dataForm.endDate<=this.dataForm.startDate){
                    this.$message.error('活动结束日期不能早于活动开始日期！');
                }else if(!this.dataForm.startTimeVo){
                    this.$message.error('请输入活动开始时间！');
                }else if(!this.dataForm.endTimeVo){
                    this.$message.error('请输入活动结束时间！');
                }else if(this.dataForm.endTimeVo<=this.dataForm.startTimeVo){
                    this.$message.error('活动结束时间不能早于活动开始时间！');
                }else{
                    addVoluntary(this.dataForm).then((res)=>{
                    this.getList()
                    this.dialogFormVisible=false
                    this.$notify.success({
                        title: '成功',
                        message: '添加成功'
                    })
                  }).catch((err)=>{
                     console.log(err)
                     this.$notify.error({
                        title: '失败',
                        message: '添加失败'
                    })
                 })
                }
				
			},
			
			handleUpdate(row){
				this.dialogStatus = 'update'
                this.dialogFormVisible = true
                
                this.dataForm = Object.assign({}, row)
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })

			},
			updateVoluntary(){
				//console.log('11'+this.schoolInfo)
                if(this.dataForm.schoolInfo!=this.dataForm.schoolName){
                    this.dataForm.schoolId=this.dataForm.schoolInfo
                }
				
				for(var i=0;i<this.schools.length;i++){
					if(this.schools[i].id=this.dataForm.schoolId){
						this.dataForm.schoolName=this.schools[i].name.split(/\s+/)[0]
					}
				}
                this.dataForm.startTime=this.dataForm.startDate+" "+this.dataForm.startTimeVo
                this.dataForm.endTime=this.dataForm.endDate+" "+this.dataForm.endTimeVo
                if(!this.dataForm.schoolId){
                    this.$message.error('请输入学校名称！');
                }else if(!this.dataForm.clockAddress){
                    this.$message.error('请输入打卡地址！');
                }else if(!this.dataForm.startDate){
                    this.$message.error('请输入活动开始日期！');
                }else if(!this.dataForm.endDate){
                    this.$message.error('请输入活动结束日期！');
                }else if(this.dataForm.endDate<=this.dataForm.startDate){
                    this.$message.error('活动结束日期不能早于活动开始日期！');
                }else if(!this.dataForm.startTimeVo){
                    this.$message.error('请输入活动开始时间！');
                }else if(!this.dataForm.endTimeVo){
                    this.$message.error('请输入活动结束时间！');
                }else if(this.dataForm.endTimeVo<=this.dataForm.startTimeVo){
                    this.$message.error('活动结束时间不能早于活动开始时间！');
                }else{
                    updateVoluntary(this.dataForm).then((res)=>{
                    this.getList()
                    this.dialogFormVisible=false
                    this.$notify.success({
                        title: '成功',
                        message: '更新成功'
                    })
                }).catch((err)=>{
                    console.log(err)
                })
                }
				
			},
			handleDelete(row){
				this.deleted.ids=row.id
				deleteVoluntary(this.deleted).then((res)=>{
					this.$notify.success({
                        title: '成功',
                        message: '删除成功'
                    })
                    this.getList()
				}).catch((err)=>{
					this.$notify.error({
                        title: '失败',
                        message: response.data.errmsg
                    })
				})
			},
			focus() {
                var th = this
                var map = new BMap.Map('bmap', {enableMapClick: true});    // 创建Map实例
                map.centerAndZoom(new BMap.Point(110.21, 31.24), 11);  // 初始化地图,设置中心点坐标和地图级别

                //添加地图类型控件
                map.addControl(new BMap.MapTypeControl({
                    mapTypes: [
                        BMAP_NORMAL_MAP,
                        BMAP_HYBRID_MAP
                    ]
                }));
                //map.setCurrentCity("成都");          // 设置地图显示的城市 此项是必须设置的
                map.enableScrollWheelZoom(true);
                var auto = new BMap.Autocomplete({
                    "input": "suggestId",
                    "location": map
                })
                //console.log(auto)
                var myValue
                //鼠标点击下拉列表后的事件
                auto.addEventListener("onconfirm", function (e) {
                    var _value = e.item.value;
                    //console.log('ee'+_value)
                    myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                    //this.address_detail = myValue
                    //th.dataForm.address = myValue;
                    th.dataForm.clockAddress = myValue;

                    setPlace();
                    auto = undefined;
                });

                function setPlace() {
                    //清除地图上所有覆盖物
                    map.clearOverlays();

                    function myFun() {
                        //获取第一个智能搜索的结果
                        console.log('aa' + local.getResults().getPoi(0).point);
                        th.dataForm.latitude = local.getResults().getPoi(0).point.lat;
                        th.dataForm.longitude = local.getResults().getPoi(0).point.lng;
                        //console.log(th.dataForm.longitude);
                        //this.userlocation = local.getResults().getPoi(0).point;
                        // map.centerAndZoom(local.getResults().getPoi(0).point, 18);
                        // //添加标注
                        // map.addOverlay(new BMap.Marker(local.getResults().getPoi(0).point));
                    }

                    //智能搜索
                    var local = new BMap.LocalSearch(map, {
                        onSearchComplete: myFun
                    });
                    local.search(myValue);

                    //测试输出坐标（指的是输入框最后确定地点的经纬度）
                    // map.addEventListener("click",function(e){
                    //     //经度
                    //     console.log(this.userlocation.lng);
                    //     //维度
                    //     console.log(this.userlocation.lat);
                    // })
                }


            },
            handleDownload() {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = [
                        '学校ID',
                        '学校名称',
                        '打卡地址',
                        '服务日期',
                        '服务时间'
                        
                    ]
                    const filterVal = ['schoolId', 'schoolName', 'clockAddress', 'volunDate', 'volunTime']
                    excel.export_json_to_excel2(
                        tHeader,
                        this.list,
                        filterVal,
                        '志愿活动'
                    )
                    this.downloadLoading = false
                })
            },

		}
	}
</script>
<style>
    .bmap {
        width: 100%;
        height: 200px;
        overflow: hidden;
        margin: 0;
        display: none;
    }

    .tangram-suggestion-main {
        z-index: 999999;
    }
</style>