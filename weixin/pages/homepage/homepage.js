// pages/homepage/homepage.js
const app = getApp()
const util = require('../../utils/util.js')
const getlist = require('../../utils/list.js')
const imageURL = app.globalData.imageUrl
const hotimgURL=app.globalData.imageURL
const imgURL = '../../images/homepage'
const categoryUrl = '/mall/admin/category/list'
const exhibitionUrl = '/mall/admin/ad/list'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picList: [],
    itemList: [],
    typeList: [],
    schoolList: [],
    hotList: [{ hotid: '1', text: '专家库', src: hotimgURL + '/1.png' }, { hotid: '2', text: '志愿服务', src: hotimgURL + '/2.png' }, { hotid: '3', text: '优质视频', src: hotimgURL + '/3.png' }, { hotid: '4', text: '考试报名', src: hotimgURL + '/4.png' },{ hotid: '5', text: '学习分享', src: hotimgURL + '/5.png' }, { hotid: '6', text: '意见反馈', src: hotimgURL + '/6.png'}],
    isIphone5: false
  },

  //根据类目信息获取首页展示信息
  // getShowInfo: function(i, type) {
  //   const getUrl = '/mall/admin/school/list'
  //   getlist.getList(getUrl, type, 1, this, 'typeList[' + i + '].schoolList', 4)
  // },

  //获取类目信息和核心展示信息
  getInfo: function(data) {
    console.log('types',data)
    let itemList = [],
      typeList = [],
      item = {}
    for (var i = 0, len = data.length; i < len; i++) {
      item = {}
      item['src'] = util.jointUrl(data[i]['iconUrl'])

      item['text'] = data[i]['name']
      item['type'] = i == len - 1 ? 0 : data[i]['id']
      itemList.push(item)
      if (i < len - 1) {
        typeList.push(item)
        //获取该类目的展示信息
        //this.getShowInfo(i, data[i]['id'])
      }
    }
    this.setData({
      itemList: itemList,
      typeList: typeList
    })
  },

  //获取渲染广告
  getAd:function(data){
    let picList=[],
    item={}
    for (var i = 0, len = data.length; i < len; i++){
      item={}
      item['src'] =util.jointUrl(data[i]['url']);
      console.log(item['src'])
      item['id'] = data[i]['param']
      item['type']=data[i]['linkType']
      picList.push(item)
    }
    this.setData({
      picList: picList,
    })
    console.log('picList',picList)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //请求学校类目数据
    app.wxRequest(categoryUrl, {
      type: 1,
      limit: 20
    }, 'get').then(data => {
      const res = data.data
      if (res['errno'] == 0) {
        //请求成功，封装数据
        this.getInfo(res['data']['items'])
      } else {
        util.errorTip(res.errmsg)
      }
    })
    //请求广告
    app.wxRequest(exhibitionUrl, {
      position: 0,
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
  goToSchool: function(e) {
    const that = this
    const type = e.currentTarget.dataset.type
    app.globalData.schoolType = type
    wx.switchTab({
      url: '/pages/school/school',
      success: function(e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  adDetails:function(e){//广告跳转
    const that=this
    const type = e.currentTarget.dataset.type
 
    if(type==0){//学校详情
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/school/details/details?id=' + id,
      })
    }else if(type==1){//课程详情
      const courseId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/school/details/course/course?schoolId=' + this.data.id + '&courseId=' + courseId +
          '&lat=' + this.data.latitude + '&lng=' + this.data.longitude,
      })
    }else if(type==2){//老师详情
      const teacherId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/school/details/teacher/teacher?schoolId=' + this.data.id + '&teacherId=' + teacherId,
      })
    }else if(type==3){//商城详情
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/store/details/details?id=' + id,
      })
    }
  },

  schoolDetails: function(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/school/details/details?id=' + id,
    })
  },
  goTohot:function(e){
    let hotid=e.currentTarget.dataset.id
    if(hotid=='2'){
      wx.navigateTo({
        url: '/pages/my/serve/serve',
      })
    } else if (hotid == '1') {
      wx.navigateTo({
        url: '/pages/expert/expert',
      })
    } else if (hotid == '99') {
      wx.navigateTo({
        url: '/pages/video/video',
      })
    } else if (hotid == '999') {
      wx.navigateTo({
        url: '/pages/examReg/examReg',
      })
    } else{
      wx.showToast({
        title: '功能未开放',
        icon: 'none'
      })
    }
  },
  goTop: function (e) {  // 一键回到顶部
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  goMiniprogram:function(e){
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
  swiperChange: function(e) {
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