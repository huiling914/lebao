// pages/examReg/examReg.js
const app = getApp()
const util = require('../../utils/util.js')
const getexamRegUrl = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    examList: [{ id: 1 ,name:'音乐'}, { id: 2,name:'美术' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    that.setData({
      isIphone5: app.globalData.isIphone5,
    })
    // app.wxRequest(getexamRegUrl, {
    //   limit: 20
    // }, 'get').then(res => {
    //   console.log(res.data)
    //   if (res.data.errno === 0) {
    //     let examList = res.data.data.items
    //     this.setData({
    //       examList: examList
    //     })

    //   } else {
    //     util.errorTip('获取失败')
    //     console.log(res.data.errmsg)
    //   }
    // })

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


  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})