// pages/school/school.js
const app = getApp()
const util = require('../../utils/util.js')
const getlist = require('../../utils/list.js')
const imageURL = app.globalData.imageUrl
const getUrl = '/mall/admin/school/list'
const exhibitionUrl = '/mall/admin/ad/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentType: -1,
    contentHeight: '',
    isIphone5: '',
    navbarList: [],
    hotPic:[],
    schoolList: [],
    scrollTop:0,
  },

  //获取类目信息和核心展示信息
  getCategory: function(data) {
    let navbarList = [],
      item = {},
      currentType = data[0]['id']
    //判断当前type是否有值
    if (this.data.currentType != -1) {
      currentType = this.data.currentType
    }
    item = {}
    item['name'] = '全部'
    item['type'] = 0
    navbarList.push(item)
    console.log('navbar', navbarList)
    //请求获取第一组数据展示
    getlist.getList(getUrl, currentType, 1, this, 'schoolList')
    for (var i = 0, len = data.length-1 ; i < len; i++) {
      item = {}
      item['name'] = data[i]['name']
      item['type'] = data[i]['id']
      navbarList.push(item)
    }
    this.setData({
      navbarList: navbarList,
      currentType: currentType
    })
  },
  //获取渲染广告
  getAd: function (data) {
    console.log(data)
    let hotPic = [],
      item = {}
    for (var i = 0, len = data.length; i < len; i++) {
      item = {}
      item['src'] = util.jointUrl(data[i]['url']);
      item['id'] = data[i]['param']
      item['type'] = data[i]['linkType']
      hotPic.push(item)
    }
    this.setData({
      hotPic: hotPic,
    })
    console.log('hotPic',hotPic)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    const that = this
    let contentHeight = 0
    if (app.globalData.isIphone5) {
      contentHeight = app.globalData.sysH - 104
    } else {
      contentHeight = app.globalData.sysH - 100
    }
    let currentType = app.globalData.schoolType
    that.setData({
      isIphone5: app.globalData.isIphone5,
      contentHeight: contentHeight,
      currentType: currentType
    })
    console.log('currentType', that.data.currentType)
    //请求学校类目数据
    app.wxRequest('/mall/admin/category/list', {
      type: 1,
      limit: 20
    }, 'get').then(data => {
      const res = data.data
      if (res['errno'] == 0) {
        //请求成功，封装数据
        this.getCategory(res['data']['items'])
      } else {
        util.errorTip(res.errmsg)
      }
    })
    //请求广告
    app.wxRequest(exhibitionUrl, {
      position: 1,
      limit: 20
    }, 'get').then(data => {
      const res = data.data
      if (res['errno'] == 0) {
        //请求成功，封装数据
        this.getAd(res['data']['items'])
      } else {
        util.errorTip(res.errmsg)
      }
    })
  },

  changeType: function(e) {
    const that = this
    const type = e.currentTarget.dataset.type
    that.setData({
      currentType: type,
    })
    getlist.getList(getUrl, type, 1, that, 'schoolList')
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
    app.globalData.schoolType = 0
  },
  search: function() {
    wx.navigateTo({
      url: '/pages/search/search?page=school',
    })
  },
  schoolDetails: function(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'details/details?id=' + id,
    })
  },
  adDetails: function (e) {//广告跳转
    const that = this
    const type = e.currentTarget.dataset.type
    console.log('type', type)
    if (type == 0) {//学校详情
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/school/details/details?id=' + id,
      })
    } else if (type == 1) {//课程详情
      const courseId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/school/details/course/course?schoolId=' + this.data.id + '&courseId=' + courseId +
          '&lat=' + this.data.latitude + '&lng=' + this.data.longitude,
      })
    } else if (type == 2) {//老师详情
      const teacherId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/school/details/teacher/teacher?schoolId=' + this.data.id + '&teacherId=' + teacherId,
      })
    } 
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var self = this;
    setTimeout(() => {
      // 模拟请求数据，并渲染
      var arr = self.data.dataList,
        max = Math.max(...arr);
      for (var i = max + 1; i <= max + 3; ++i) {
        arr.unshift(i);
      }
      self.setData({
        dataList: arr
      });
      // 数据成功后，停止下拉刷新
      wx.stopPullDownRefresh();
    }, 1000);
  },
  onReachBottom: function() {
    var arr = this.data.dataList,
      max = Math.max(...arr);
    if (this.data.count < 3) {
      for (var i = max + 1; i <= max + 5; ++i) {
        arr.push(i);
      }
      this.setData({
        dataList: arr,
        count: ++this.data.count
      });
    } else {
      util.errorTip('没有更多数据了！')
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  // 获取滚动条当前位置
  scroll: function (e) {
    console.log(e)
  },

  goTop: function (e) {  // 一键回到顶部
    let _top=this.data.scrollTop;
    if(_top==1){
      _top=0
    }else{
      _top=1
    }
    this.setData({
      scrollTop: _top
    });
  },
  goMiniprogram: function (e) {
    wx.navigateToMiniProgram({
      appId: 'wx0aeac8991ae4cd33',
      path: '',
      extraData: {
        openid: app.globalData.openid
      },
      envVersion: 'release',
      success(res) {
        console.log('打开成功')// 打开成功
      }
    })
  },
  swiperChange: function (e) {
    this.setData({
      currentTab: e.detail.current
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