// pages/shop/shop-order.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: "",
    provinceName: "",
    cityName: "",
    countyName: "",
    detailInfo: "",
    telNumber: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var id=options.id
    wx.request({
      url: app.globalData.mall_pre_order,
      data: {
        type: 1,
        id: id, authkey: app.globalData.userInfo.authkey,

      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all);
        that.setData({
          order_detail:all.data.data
        })
      }
    })
  },
  onAddress:function(){
    var that=this;
    wx.chooseAddress({
      success: function (res) {
        that.setData({
          userName:res.userName,
          provinceName: res.provinceName,
          cityName: res.cityName,
          countyName: res.countyName,
          detailInfo: res.detailInfo,
          telNumber: res.telNumber
        })
      }
    })
  },
  onPay:function(e){
    var that=this;
    wx.request({
      url: app.globalData.wx_payfee,
      data: {
        type: 1,
        tel: that.data.telNumber,
        name: that.data.userName,
        province: that.data.provinceName,
        city: that.data.cityName,
        area: that.data.countyName,
        address: that.data.detailInfo,
        id: app.globalData.openId,
        fee:0.01,
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all);
        wx.requestPayment({
          'timeStamp': all.data.timeStamp,
          'nonceStr': all.data.nonceStr,
          'package': all.data.package,
          'signType': 'MD5',
          'paySign': all.data.sign,
          'success': function (res) {
          },
          'fail': function (res) {
            console.log(res);
          }
        })
      },fail:function(all){
        console.log(all);
      }
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