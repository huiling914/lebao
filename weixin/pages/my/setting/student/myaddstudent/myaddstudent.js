// pages/confirmOrder/addstudent/addstudentdetail/addstudentdetail.js
const app = getApp()
const util = require('../../../../../utils/util.js')
const addUrl = '/base/user/favorStu/add'
const schList = '/mall/admin/pub/school/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseinfo: '',
    isIphone5: false,
    name: '',
    grade: '',
    birthday: '',
    gender: '',
    relation: '',
    relationindex: '',
    schoolid:'',
    schindex:'',
    mobile: '',
    sex: [{ name: '男', value: 1 }, { name: '女', value: 0 }],
    array: ['父亲', '母亲', '爷爷', '奶奶', '外公', '外婆', '姐姐', '哥哥', '本人','同学'],
    schList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isIphone5: app.globalData.isIphone5
    })
    app.wxRequest(schList, {},'get').then(res => {
      console.log(res.data)
      if (res.data.errno == 0) {
        //请求成功
        let schlist= res.data.data.items
        let schoolList=[]
        for(var i=0;i<schlist.length;i++){
          let item={}
          item.id=schlist[i].id
          item.name=schlist[i].name
          schoolList.push(item)
        }
        console.log(schoolList)
        this.setData({
          schList: schoolList
        })
        
      } else {
        util.errorTip(res.errmsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  getname: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  getgrade: function (e) {
    this.setData({
      grade: e.detail.value
    })
  },
  getmobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  bindDateChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  bindrelaChange(e) {
    this.setData({
      relation: this.data.array[e.detail.value],
      relationindex: e.detail.value
    })
  },
  bindschChange(e) {
    this.setData({
      schindex: e.detail.value,
      schoolid: this.data.schList[e.detail.value].id
    })
    console.log(this.data.schoolid)
  },
  radioChange(e) {
    this.setData({
      gender: e.detail.value
    })

  },
  adddetailcon: function () {
    if (!this.data.name) {
      util.errorTip('请输入姓名')
      return
    }
    if (!this.data.gender) {
      util.errorTip('请选择性别')
      return
    }
    if (!this.data.schoolid) {
      util.errorTip('请选择学校')
      return
    }
    if (!this.data.grade) {
      util.errorTip('请输入年级')
      return
    }
    if (!this.data.birthday) {
      util.errorTip('请输入生日')
      return
    }
    if (!this.data.relationindex) {
      util.errorTip('请选择关系')
      return
    }
    if (!this.data.mobile) {
      util.errorTip('请输入手机')
      return
    }
    if (!/^((13[0-9])|(14[5,7,9])|(15[^4])|(16[6])|(17[0,1,2,3,5,6,7,8])|(18[0-9])|(19[8,9]))\d{8}$/.test(this.data.mobile)) {
      util.errorTip('请输入正确的号码')
      return
    }
    app.wxRequest(addUrl, {//添加学生
      name: this.data.name,
      gender: parseInt(this.data.gender),
      schoolId: parseInt(this.data.schoolid),
      grade: parseInt(this.data.grade),
      birthday: this.data.birthday,
      relation: parseInt(this.data.relationindex),
      mobile: this.data.mobile
    }).then(res => {
      console.log(res.data)
      if (res.data.errno == 0) {
        //请求成功

      } else {
        util.errorTip(res.errmsg)
      }
    })
    wx.redirectTo({
      url: '/pages/my/setting/student/student'
    })
  }
})