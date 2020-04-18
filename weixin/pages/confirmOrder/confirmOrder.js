// pages/confirmOrder/confirmOrder.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseinfo:'',
    isIphone5: false,
    totalPrice:'',
    addstudentList: [],
    time:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    let courseinfo=JSON.parse(options.courseinfoStr)
    console.log(courseinfo)   
    that.setData({
      courseinfo:courseinfo,
      isIphone5: app.globalData.isIphone5
    })
    if (options.chooseStudentListstr){
      let chooseStudentList = JSON.parse(options.chooseStudentListstr)
      console.log(chooseStudentList)
      that.setData({
        addstudentList: chooseStudentList,
      })
      setTimeout(function () {
        let num = that.data.addstudentList.length
        let totalPrice = that.data.courseinfo.goodsPrice * num
        that.setData({
          totalPrice: totalPrice,
        })
      }, 1000)
    }
    
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
addstudent:function(){
  let courseinfoStr = JSON.stringify(this.data.courseinfo)
  wx.navigateTo({
    url: '/pages/confirmOrder/addstudent/addstudent?courseinfoStr='+courseinfoStr
  })
},
  getTime: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  signUp: function () {
    if (this.data.addstudentList.length===0) {
      util.errorTip('请选择至少一位学员')
      return
    }
    if (!this.data.time) {
      util.errorTip('请输入预约上课时间')
      return
    }
    let addstudentList = this.data.addstudentList
    // let totalPrice = parseFloat(this.data.totalPrice.toFixed(2))
    let details=[]
    for (var i = 0; i <addstudentList.length;i++){
      let item={}
      item.schoolId=parseInt(this.data.courseinfo.brandId)
      item.schoolName=this.data.courseinfo.schoolName
      item.classId=parseInt(this.data.courseinfo.courseId)
      item.className=this.data.courseinfo.courseName
      item.picUrl=this.data.courseinfo.logoUrl
      item.stuId=addstudentList[i].id
      item.stuName=addstudentList[i].name
      item.stuGender=addstudentList[i].gender
      item.mobile=addstudentList[i].mobile
      item.remark=this.data.time
      item.price = this.data.courseinfo.goodsPrice
      details.push(item)
    }
    let createinfo = {
      orderType: 1,
      orgId: parseInt(this.data.courseinfo.brandId),
      objId:parseInt(this.data.courseinfo.courseId),
      goodsPrice: parseFloat(this.data.totalPrice.toFixed(2)),
      details:details
    }
   
    let createinfoStr = JSON.stringify(createinfo)
    
    wx.navigateTo({
      url: '/pages/createOrder/create?createinfoStr=' + createinfoStr
    })

  },
 
})