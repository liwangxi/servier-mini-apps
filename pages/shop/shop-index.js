// pages/shop/shop-index.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:"",
    product_list:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //用户信息接口
    wx.request({
      url: app.globalData.mall_user,
      data: {
        type: '1',
        authkey: app.globalData.userInfo.authkey,

      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all);
        that.setData({
          user:all.data.data
        })
      }
    });
    //商品列表接口
    wx.request({
      url: app.globalData.mall_product_list,
      data: {
        type: 1,
        pages:1,
        authkey: app.globalData.userInfo.authkey,

      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all);
        that.setData({
          product_list:all.data.data
        })
      }
    });
  },
  onDetail:function(e){
    var cid = e.currentTarget.dataset.cid
    console.log(cid)
    wx.navigateTo({
      url: 'shop-detail?id='+cid,
    })
  },
  onEarn: function (e) {
    wx.navigateTo({
      url: 'shop-earn',
    })
  },
  onPut: function (e) {
    wx.navigateTo({
      url: 'shop-put',
    })
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