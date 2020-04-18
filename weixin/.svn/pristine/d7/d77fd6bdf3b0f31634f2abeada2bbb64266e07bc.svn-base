// pages/my/setting/personinfo/personinfo.js
const app = getApp()
const util = require('../../../../utils/util.js')
const updateUrl = '/base/user/account/update'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    birthday:'',
    remark:'',
    isIphone5: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({   
      isIphone5: app.globalData.isIphone5
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
  bindDateChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
 getremark(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  adddetailcon: function () {
    if (!this.data.name) {
      util.errorTip('请输入姓名')
      return
    }
    if (!this.data.birthday) {
      util.errorTip('请输入生日')
      return
    }
    if (!this.data.remark) {
      util.errorTip('请输入备注信息')
      return
    }
    app.wxRequest(updateUrl, {
      name: this.data.name,
      birthday: this.data.birthday,
      remark:this.data.remark
    }).then(res => {
      console.log(res.data)
      if (res.data.errno == 0) {
        //请求成功
        wx.showToast({
          title: '修改成功！',
          icon: 'success'
        })
      } else {
        util.errorTip(res.errmsg)
      }
    })
    wx.redirectTo({
      url: '/pages/my/setting/setting'
    })
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})