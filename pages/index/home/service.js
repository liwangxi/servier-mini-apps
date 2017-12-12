// pages/index/home/service.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    authkey: "",
    sn: "",
    service: "",
    phoneNumber: "",
    other_info: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this
    var order_sn = e.order_sn;
    that.setData({
      order_sn: order_sn
    })
    wx.getStorage({
      key: 'key',
      success: function (res) {
        var key = res.data.authkey;
        that.setData({
          authkey: key
        })
        wx.request({
          url: app.globalData.order_detail_url,
          data: {
            authkey: key,
            sn: order_sn,
            type: 1,
          },
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (all) {
            var order_detail = all.data.data;
            if (all.data.r == 1) {
              that.data.service = setInterval(function () {
                wx.request({
                  url: app.globalData.list_order_url,
                  data: {
                    authkey: that.data.authkey,
                    order_sn: that.data.order_sn,
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  method: "GET",
                  success: function (all) {
                    if (all.data.r == 1) {
                      clearInterval(that.data.service);
                      wx.reLaunch({
                        url: '/pages/index/home/pay?&order_sn=' + that.data.order_sn + ''
                      })
                    }
                  }
                })
              }, 2000)
              var other_info = all.data.data.store_info;
              var http = other_info.header_pic.substr(0, 4);
              if (http != "http") {
                other_info.header_pic = app.globalData.url + other_info.header_pic.slice(2);
              }
              // other_info.header_pic = app.globalData.url + other_info.header_pic.slice(2);
              var mobile = other_info.phone;
              that.setData({
                phoneNumber: mobile,
                other_info: other_info,
              })
            }
          }
        });
      },
    })
  },
  call_locker: function (e) {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.phoneNumber
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})