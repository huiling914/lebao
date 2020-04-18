// pages/my/refund/apply/apply.js
const app = getApp()
const util = require('../../../../utils/util.js')
const getUrl = '/biz/trade/order/consume/list/my'
const applyUrl = '/biz/trade/refund/apply'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone5: false,
    reason: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    that.setData({
      orderSn: options.sn,
      isIphone5: app.globalData.isIphone5
    })
    app.wxRequest(getUrl, {
      sn: options.sn
    }, 'get').then(res => {
      if (res.statusCode == 200) {
        console.log('apply',res.data)
        if (res.data.errno == 0) {
          let data = res.data.data.items[0]
          let orgId=data.orgId,
            orgName = data.orgName,
            status = data.orderStatus,
            statusText = '',
            picUrl = util.jointUrl(data.orgLogoUrl),
            addTime = data.addTime,
            price = data.orderPrice,
            phone = data.orgPhonePrimary,
            address = data.orgAddress,
            brandId = data.id,
            vouchersPrice = data.vouchersPrice,
            balancePrice = data.balancePrice

          switch (data.orderStatus) {
            case 0:
              statusText = '待支付'
              break
            case 1:
              statusText = '待评价'
              break
            case 2:
              statusText = '退款'
              break
            case 3:
              statusText = '已取消'
              break
            case 4:
              statusText = '已评价'
              break
          }
          that.setData({
            orgId:orgId,
            orgName: orgName,
            status: status,
            statusText: statusText,
            picUrl: picUrl,
            addTime: addTime,
            price: price,
            address: address,
            phone: phone,
            brandId: brandId,
            vouchersPrice: vouchersPrice,
            balancePrice: balancePrice
          })
        } else {
          util.errorTip('获取失败')
          console.log(res.data.errmsg)
        }
      } else {
        util.errorTip('请求失败')
        console.log(res.errmsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  inputReason: function(e) {
    let value = e.detail.value
    this.setData({
      reason: value
    })
  },
  ensureRefund: function() {
    const that = this
    if(that.data.reason == '')
    {
      util.errorTip('请输入退款原因！')
      return false
    }
    wx.showLoading({
      title: '申请中..',
    })
    app.wxRequest(applyUrl, {
      balancePrice: that.data.balancePrice,
      brandId: that.data.orgId,
      orderSn: that.data.orderSn,
      vouchersPrice: that.data.vouchersPrice,
      reason: that.data.reason
    }).then(res => {
      if (res.statusCode == 200) {
        if (res.data.errno == 0) {
          let id = res.data.data.id
          wx.hideLoading()
          wx.showToast({
            title: '申请成功！',
            icon: 'success'
          })
          setTimeout(function() {
            wx.redirectTo({
              url: '../details/details?orderSn=' + that.data.orderSn,
            })
          }, 1500)
        } else {
          util.errorTip('申请失败')
          console.log(res.data.errmsg)
        }
      } else {
        util.errorTip('请求失败')
        console.log(res.errmsg)
      }
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