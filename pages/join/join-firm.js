// pages/join/join-firm.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    firm_detail:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id
    var that = this
    //合作企业banner接口
    wx.request({
      url: app.globalData.cooperation_detail,
      data: {
        type: 1,
        id:1
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all);   
        that.setData({
          firm_detail: all.data.data
        })
      }
    })
  },
  onPhone: function (e) {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: "17607990359" //仅为示例，并非真实的电话号码
    })
  },
  onShareAppMessage: function () {

  }
})