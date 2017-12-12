// pages/order/user.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    phone: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    wx.getStorage({
      key: 'key',
      success: function (res) {
        // 在缓存中取authkey
        console.log(res);
        that.setData({
          userInfo: res.data.userInfo,
          phone: res.data.userInfo.mobile
        })
        var authkey = res.data;
      },
    })
  },

  onOreder: function () {
    var that = this;
    that.setData({
      phone: getApp().globalData.mobile
    })
    console.log(that.data.phone);
    // var phone_number = getApp().globalData.mobile
    if (that.data.phone == "" || that.data.phone == null) {
      wx.navigateTo({
        url: '../reg/reg?id=1'
      })
    } else {
      wx.navigateTo({
        url: 'user-shop-order'
      })
    }
  },
  onNews: function () {
    wx.navigateTo({
      url: 'user-headline'
    })
  },
  onDis: function () {
    wx.navigateTo({
      url: 'user-discount'
    })
  },
  onCell:function(){
    wx.navigateTo({
      url:'user-collect'
    })
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