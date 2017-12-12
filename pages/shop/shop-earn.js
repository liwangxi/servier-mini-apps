// pages/shop/shop-earn.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payment: 0,
    earn: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    //用户收入接口
    wx.request({
      url: app.globalData.mall_payment,
      data: {
        type: 1,
        payment: that.data.payment,
        authkey: app.globalData.userInfo.authkey,

      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all);
        that.setData({
          earn: all.data.data,
        })
      }
    });
  },
  onTab:function(e){
    var that=this;
    var cid = e.currentTarget.dataset.cid
    wx.request({
      url: app.globalData.mall_payment,
      data: {
        type: 1,
        payment: cid,
        authkey: app.globalData.userInfo.authkey,

      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all);
        that.setData({
          earn: all.data.data,
          payment:cid
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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