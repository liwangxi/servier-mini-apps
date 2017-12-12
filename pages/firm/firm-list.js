// pages/firm/firm-list.js
var imageUtil = require('../libs/util.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    reg_banner: '',
    imagewidth: '',
    imageheight: '',
    windowWidth: '',
    windowHeight: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showToast({
      icon: "loading",
      title: "数据加载中"
    }),
      //获取屏幕宽高
      wx.getSystemInfo({
        success: function (res) {
          var windowWidth = res.windowWidth;
          var windowHeight = res.windowHeight;
          var windowscale = windowHeight / windowWidth;//屏幕高宽比  
          that.setData({
            windowWidth: windowWidth,
            windowHeight: windowHeight,
          })
        }
      })
    wx.request({
      url: app.globalData.reg_banner,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        that.setData({
          reg_banner: res.data.data
        })
      }
    })
  },
  // 图片自适应
  imageLoad: function (e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight - 60
    })
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

  },
})