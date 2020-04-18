// pages/my/setting/setting.js
const app = getApp()
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infroList: [{
        infro: '手机号',
        detail: '',
        event: 'phone'
      },
      /*{
        infro: '登录密码',
        detail: '',
        event: 'login'
      },*/
      {
        infro: '支付密码',
        detail: '',
        event: 'pay'
      },
      {
        infro: '我的银行卡',
        detail: '',
        event: 'goToBankcard'
      },
      {
        infro: '我的学员',
        detail: '',
        event: 'goToStudent'
      },
      {
        infro: '个人资料',
        detail: '',
        event: 'goToPersoninfo'
      },
      {
        infro: '帮助中心',
        detail: '',
        event: 'helpCenter'
      },
     
    ],
    sysH: '',
    marTop: '',
    isIphone5: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    let marTop = app.globalData.sysH - 365
    let infroList = that.data.infroList
    const myInfo=app.globalData.myInfo
    let mobile = myInfo['mobile']
    infroList[0].detail = mobile.substring(0, 3) + '****' + mobile.substring(7, 11)
    that.setData({
      phone: mobile,
      infroList: infroList
    })
    that.setData({
      marTop: marTop,
      isIphone5: app.globalData.isIphone5
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  reset: function(e) {
    const event = e.currentTarget.dataset.event
    if (event == 'goToBankcard') {
      this.goToBankcard()
    } else if (event === 'helpCenter') {
      this.helpCenter()
    } else if (event === 'goToStudent') {
      this.goToStudent()
    } else if (event === 'goToPersoninfo') {
      this.goToPersoninfo()
    }else{
      wx.navigateTo({
        url: 'reset/reset?phone=' + this.data.phone + '&event=' + event,
      })
      
    }
  },
  goToBankcard: function() {
    wx.navigateTo({
      url: 'bankcard/bankcard',
    })
  },
  goToStudent: function () {
    wx.navigateTo({
      url: 'student/student',
    })
  },
  goToPersoninfo: function () {
    wx.navigateTo({
      url: 'personinfo/personinfo',
    })
  },
  helpCenter: () => {
    wx.navigateTo({
      url: 'help/help',
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