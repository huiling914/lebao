// pages/video/video.js
const app = getApp()
const util = require('../../utils/util.js')
const getVideoUrl = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    videoList: [{ id: 1, src: 'http://lebao.oss-cn-beijing.aliyuncs.com/brand/admin-20190509-0776af22ed5a417f85824a31c87a7195.mp4' }, { id: 2, src: 'http://lebao.oss-cn-beijing.aliyuncs.com/brand/admin-20190509-0776af22ed5a417f85824a31c87a7195.mp4' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    that.setData({
      isIphone5: app.globalData.isIphone5,
    })
    // app.wxRequest(getVideoUrl, {
    //   limit: 20
    // }, 'get').then(res => {
    //   console.log(res.data)
    //   if (res.data.errno === 0) {
    //     let signList = res.data.data.items
    //     this.setData({
    //       signList: signList
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