// pages/index/home/pay.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authkey: "",
    sn: "",
    phoneNumber: "",
    store_info: "",
    order: "",
    openid: ""
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
        var key = res.data.authkey
        console.log(res);
        var openid = res.data.openid
        that.setData({
          authkey: key,
          openid: openid,
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
            var order = all.data.data;
            console.log()
            var store_info = all.data.data.store_info
            that.setData({
              store_info: store_info,
              order: order,
            })
          }
        });
      },
    })
  },
  onPay: function (e) {
    var that = this
    wx.request({
      url: app.globalData.user_order_pay_url,
      data: {
        authkey: that.data.authkey,
        sn: that.data.order_sn,
        type: 1,
        openid: app.globalData.openId,
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        if (res.data.r == 1) {
          var pay_sn = res.data.pay_sn
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.sign,
            'success': function (res) {
              console.log(res);
              wx.request({
                url: app.globalData.order_pay_success_url,
                data: {
                  authkey: that.data.authkey,
                  sn: pay_sn,
                  pay_type: 1,
                  stauts: 1,
                },
                header: {
                  'content-type': 'application/json'
                },
                method: "GET",
                success: function (all) {
                  console.log(all);
                  if (all.data.r == 1) {
                    wx.reLaunch({
                      url: 'evaluate?&order_sn=' + that.data.order_sn + ''
                    })
                  }

                },
              })
            }, fail: function (res) {
              console.log(res);
            }
          })
        }

      },
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})