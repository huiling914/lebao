// pages/school/details/course/course.js
const app = getApp()
const util = require('../../../../utils/util.js')
const getUrl = '/mall/admin/class/read/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverImgPath:'',
    pictures:'',
    schoolName: '',
    courseName: '',
    courseId:'',
    picUrl: '',
    logoUrl:'',
    originalPrice: '',
    discountPrice: '',
    teachers: '',
    times: '', //课次,
    classTime: '',
    address: '金银路八一路交叉口北150米路西',
    description: '',
    maxStudent: '',
    lat: '',
    lng: '',
    show: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    let courseId = options.courseId,
      schoolId = options.schoolId
    that.setData({
      courseId: courseId,
      schoolId: schoolId,
      isIphone5: app.globalData.isIphone5,
      lng: options.lng,
      lat: options.lat
    })
    app.wxRequest(getUrl + courseId, {}, 'get').then(res => {
      if (res.statusCode == 200) {
        if (res.data.errno == 0) {
          let course = res.data.data
          console.log(course)
          let item
          let coverImgPath = ''
          let pictures = []
          if (course.detailPictures != null && course.detailPictures.length > 0) {
            for (var i = 0; i < course.detailPictures.length; i++) {
              item = {}
              item.picUrl = util.jointUrl(course.detailPictures[i].picUrl)
              item.video = course.detailPictures[i].video
              if (item.video && 'videoCoverUrl' in course) {
                coverImgPath = util.jointUrl(course.videoCoverUrl)
              }
              pictures.push(item)
            }
            console.log('coursepictures',pictures)
          }
          let schoolName = course.schoolName,
            courseName = course.name,
            picUrl = util.jointUrl(course.pictureUrl),
            logoUrl =course.pictureUrl,
            teacherList = '',
            originalPrice = course.counterPrice,
            discountPrice = course.retailPrice,
            times = course.times,
            classTime=course.timeDescription,
            description = course.description,
            maxStudent = course.maxStudent,
            address = course.address,
            phone = course.phone
          wx.setNavigationBarTitle({
            title: schoolName
          })
          if (course.litemallTeacherList.length == 0) {
            teacherList = '待定'
          } else {
            let teacher = ''
            for (var j = 0; j < course.litemallTeacherList.length; j++) {
              teacher = ''
              teacher = course.litemallTeacherList[j].name
              teacherList += teacher + '、'
            }
            teacherList = teacherList.substring(0, teacherList.length - 1)
          }
          that.setData({
            pictures:pictures,
            coverImgPath: coverImgPath,
            schoolName: schoolName,
            courseName: courseName,
            picUrl: picUrl,
            logoUrl:logoUrl,
            teacher: teacherList,
            originalPrice: originalPrice,
            discountPrice: discountPrice,
            times: times,
            classTime:classTime,
            description: description,
            maxStudent: maxStudent,
            address: address,
            phone: phone
          })
          wx.setNavigationBarTitle({
            title: schoolName
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
  //打电话
  goToAddress: function() {
    if (this.data.lat != '') {
      wx.openLocation({
        latitude: parseFloat(this.data.lat),
        longitude: parseFloat(this.data.lng),
        success: function(res) {
          console.log('res', res)
        }
      })
    }
  },
  signUp: function() {
    let courseinfo={
      orderType:1,
      schoolName: this.data.schoolName,
      courseName: this.data.courseName,
      brandId: this.data.schoolId,
      courseId:this.data.courseId,
      goodsPrice:this.data.discountPrice,
      classTime:this.data.classTime,
      address:this.data.address,
      logoUrl:this.data.logoUrl
    }
    let courseinfoStr = JSON.stringify(courseinfo)
    console.log(courseinfoStr)
    wx.navigateTo({
      // url: '/pages/confirmOrder/confirmOrder?orderType=1&brandId=' + this.data.schoolId + '&goodsPrice=' + this.data.discountPrice
      url: '/pages/confirmOrder/confirmOrder?courseinfoStr='+courseinfoStr
    })
  },

  /*
     *点击自定义视频封面开始播放
     */
  playvideo: function (e) {
    let videocon = wx.createVideoContext("myVideo", this)
    videocon.play()
    console.log(videocon)
    this.setData({
      show: false
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