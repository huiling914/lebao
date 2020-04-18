// pages/expert/detail/detail.js
const app = getApp()
const util = require('../../../utils/util.js')
const expertUrl='/mall/admin/expert/read/'
//var WxParse = require('../../../components/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backUrl: '',
    expertName:'',
    description:'',
    expertId:'',
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    console.log(options)
    let expertId = options.expertId
      that.setData({
        expertId: expertId,
        isIphone5: app.globalData.isIphone5,
      })
    //请求专家详情
    app.wxRequest(expertUrl + expertId, {}, 'get').then(res => {
      console.log(res)
      if (res.data.errno == 0) {
        //请求成功，封装数据
        var description = res.data.data.description
        //var  article  = '<img src="../../../imgs/index/s.png"></img><p>微信小程序如何解析HTML富文本（使用wxParse解析富文本的demo）微信小程序如何解析HTML富文本（使用wxParse解析富文本的demo）微信小程序如何解析HTML富文本（使用wxParse解析富文本的demo）</p><p>微信小程序如何解析HTML富文本（使用wxParse解析富文本的demo）微信小程序如何解析HTML富文本（使用wxParse解析富文本的demo）微信小程序如何解析HTML富文本（使用wxParse解析富文本的demo）</p><img src="../../../imgs/index/s.png"></img><p>近两年，小青柑的火爆有目共睹，娇小玲珑的产品形态、便携式的消费场景、柑与茶结合的时尚方式以及独特的口感和养生功效，都在顺应着目前年轻化、多元化、便携化的茶叶消费市场需求，让它成为了一大爆品。</p>'  
        //WxParse.wxParse(' article', 'html', article, that, 5);
        that.setData({
          expertName: res.data.data.name,
          backUrl: res.data.data.backUrl,
          description:description,
        })
      } else {
        util.errorTip(res.data.errmsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})