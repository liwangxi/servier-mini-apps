// pages/shop/shop-detail.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product_detail:"",
    id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var id=options.id
    that.setData({
      id:id
    })
    //用户信息接口
    wx.request({
      url: app.globalData.mall_product_detail,
      data: {
        type: 1,
        id:id,
        authkey: app.globalData.userInfo.authkey,

      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all);
        that.setData({
          product_detail: all.data.data
        })
      }
    });
  },
  onPay:function(){
    wx.navigateTo({
      url: 'shop-order?id=' + this.data.id
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
  
  }
})