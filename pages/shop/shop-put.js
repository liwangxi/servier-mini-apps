// pages/shop/shop-put.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payment: 0,
    mall_payment: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //每日任务列表接口
    wx.request({
      url: app.globalData.mall_everydaytask,
      data: {
        type: 1,
        authkey: app.globalData.userInfo.authkey,
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all);
      }
    });
  },
  //签到
  onSign: function () {
    var that = this
    wx.request({
      url: app.globalData.mall_sign,
      data: {
        type: 1,
        mid: 9,
        authkey: app.globalData.userInfo.authkey,
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        if (all.data.r == 1) {
          wx.showToast({
            title: '签到成功',
            icon: 'success',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '今日已签到',
            icon: 'success',
            duration: 2000
          })
        }
        console.log(all);
      }
    });
  },
  //分享
  onShare: function () {
    var that = this
    //每日任务列表接口
    wx.showShareMenu({
      withShareTicket: true
    })
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '转发', // 转发标题（默认：当前小程序名称）
      path: '/pages/shop/shop-put', // 转发路径（当前页面 path ），必须是以 / 开头的完整路径
      success(e) {
        // shareAppMessage: ok,
        // shareTickets 数组，每一项是一个 shareTicket ，对应一个转发对象
        // 需要在页面onLoad()事件中实现接口
        wx.request({
          url: app.globalData.mall_share,
          data: {
            type: 1,
            mid: 10
          },
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (all) {
            if (all.data.r == 1) {
              wx.showToast({
                title: '分享成功',
                icon: 'success',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '今日已分享3次',
                icon: 'success',
                duration: 2000
              })
            }
            console.log(all);
          }
        });
        console.log(e);
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail(e) {
        // shareAppMessage:fail cancel
        // shareAppMessage:fail(detail message) 
      },
      complete() { }
    }
  }
})