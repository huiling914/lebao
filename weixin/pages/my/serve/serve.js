// pages/my/serve/serve.js
const app = getApp()
const util = require('../../../utils/util.js')
const getVollistUrl = '/biz/trade/voluntary/near/list'
const signUrl = '/biz/trade/voluntary/record/sign'
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    isIphone5: false,
    longitude:'',
    latitude: '',
    volList: [],
    inputschName:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
   var that=this
    that.setData({
      isIphone5: app.globalData.isIphone5,
     
    })
    wx.getLocation({
      success: function (res) {
        console.log(res)
        //保存到data里面的location里面
        that.setData({
            longitude: res.longitude,
            latitude: res.latitude
        })
        that.getVoluntary(res.longitude,res.latitude)
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
  getVoluntary:function(curLng,curLat){
    app.wxRequest(getVollistUrl,{
      curLng: curLng,
      curLat: curLat,
      schName:this.data.inputschName,
      limit: 50,
      sort:'distance',
      order: 'desc',
    }, 'get').then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let volList = res.data.data.items
        let item
        let vollist=[]
        for(var i=0;i<volList.length;i++){
          item={}
          item.distance=parseInt(volList[i].distance)
          item.schoolName = volList[i].schoolName
          item.clockAddress = volList[i].clockAddress
          item.id = volList[i].id
          item.schoolId = volList[i].schoolId
          item.longitude = volList[i].longitude
          item.latitude = volList[i].latitude
          vollist.push(item)
        }       
            this.setData({
              volList:vollist
            })
            
      } else {
        wx.hideLoading()
        util.errorTip('获取失败')
        console.log(res.data.errmsg)
      }
    })
  },
  sign:function(e){
    var that=this
    let signid=e.currentTarget.dataset.id
    let volList=that.data.volList
    let volitem
    for(var i=0;i<volList.length;i++){
      if(signid==volList[i].id){
        volitem=volList[i]
        console.log(volList[i])
      }
    }
    console.log(volitem)
    wx.getLocation({
      success: function (res) {
        console.log(res)
        that.setData({
            longitude: res.longitude,
            latitude: res.latitude
        })
      }
    })
    console.log(signid, volitem.schoolId, volitem.longitude, volitem.latitude,)
    app.wxRequest(signUrl, {
      voluntary:signid,
      school: volitem.schoolId, 
      schName: volitem.schoolName,
      curLongitude: that.data.longitude,
      curLatitude: that.data.latitude, 
      schLongitude: volitem.longitude,  
      schLatitude: volitem.latitude  
    }).then(res => {
      console.log(res.data)
      if (res.data.errno === 0) {
        let msg, integral
        if(res.data.data.status===0){
          integral=res.data.data.integral
          msg='打卡成功，您将获得'+integral+'个积分'
        }else{
          msg='打卡成功，暂无积分'
        }
        wx.showModal({
          title: '提示',
          content: msg,
          showCancel:false,
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: 'volrec/volrec',
              })
            }
          }
        })

      } else {
        util.errorTip(res.data.errmsg)
        console.log(res.data.errmsg)
      }
    })
  },
  
  inputSelect: function (e) {
    this.setData({
      inputschName: e.detail.value
    })
    
  },
  clearSelect: function () {
    this.setData({
      inputschName: ''
    })
    this.search()
  },
  search: function (e) {
    this.getVoluntary(this.data.longitude, this.data.latitude)
  },
  volRec: function () {
    wx.navigateTo({
      url: 'volrec/volrec',
    })
  },
  back: util.back,
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '乐宝教育365', // 转发后 所显示的title
      path: '/pages/loading/loading'
    }
  }
})