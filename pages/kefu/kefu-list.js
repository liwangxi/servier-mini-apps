// pages/kefu/kefu-list.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customer:""
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.request({
      url: app.globalData.customer_service,
      data: {
        type: 1,
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all);
        that.setData({
          customer: all.data.data
        })
      }
    })
  },
  onRefer: function () {
    wx.navigateTo({
      url: 'kefu-refer',
    })
  },
  onTel: function () {
    wx.navigateTo({
      url: 'kefu',
    })
  },
  onIssue: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'kefu-detail?id='+id,
    })
  },
  onPhone:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.customer.tel,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})