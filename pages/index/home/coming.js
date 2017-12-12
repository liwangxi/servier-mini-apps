var app = getApp();
var util = require('../../libs/util.js');
var total_micro_second = 20;
Page({
  data: {
    phoneNumber: "",
    time: "",
    adress_all: "",
    system_time_format: "",
    other_info: "",
    address_info: "",
    authkey: "",
    order_sn: "",
    clock: "1",
    lock_service: "",
    onInsmake: false,
    yu_time: "",
    img_order: "",
  },
  onLoad: function (e) {
    var that = this
    var order_sn = e.order_sn;
    console.log(order_sn);
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
            console.log(all);
            if (all.data.r == 1) {
              that.data.lock_service = setInterval(function () {
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
                    if (all.data.r == 3) {
                      clearInterval(that.data.lock_service);
                      wx.reLaunch({
                        url: 'service?&order_sn=' + that.data.order_sn + ''
                      })
                    }
                  }
                })
              }, 2000)
              console.log((new Date().getTime() / 1000).toString().substr(0, 10));
              total_micro_second = (all.data.data.overdue_time-(new Date().getTime() / 1000).toString().substr(0, 10))*1000;
              console.log(total_micro_second)
              var img_order = all.data.data.images
              var system_time_format =all.data.data.system_time_format;
              var ismake = all.data.data.ismake
              if (ismake == "1") {
                var onInsmake = true;
                var yu_time = util.getLocalTime(all.data.data.make_starttime)
              }
              var other_info = all.data.data.store_info;
              var mobile = other_info.phone;
              var address_info = all.data.data.address_info;
              if (address_info == null) {
                address_info = ""
              }
              that.setData({
                system_time_format: system_time_format,
                phoneNumber: mobile,
                order_detail: order_detail,
                other_info: other_info,
                address_info: address_info,
                onInsmake: onInsmake,
                yu_time: yu_time,
                img_order: img_order,
              })

            }

          }
        });

      },
    })
    count_down(that)
  },
  onUnload:function(e){
    console.log(1);
    clearInterval(this.data.lock_service);
  },
  
  //客服电话
  call_locker: function (e) {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.phoneNumber
    })
  },
  //取消订单
  cancle_order: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否取消订单',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.cancel_url,
            data: {
              authkey: that.data.authkey,
              order_sn: that.data.order_sn,
            },
            header: {
              'content-type': 'application/json'
            },
            method: "GET",
            success: function (res) {
              if (res.data.r == 1) {
                clearInterval(that.data.lock_service);
                console.log(res);
                wx.reLaunch({
                  url: "../../order/order"
                })
              }
            }
          });
        }
      }
    })
  },
  // 图片预览
  pre_img: function (e) {
    var that = this;
    console.log(e.currentTarget.id)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: that.data.img_order, // 需要预览的图片http链接列表
      success: function (res) {
        console.log(res)
      },
    })
  },
});
/* 毫秒级倒计时 */
function count_down(that) {
  // 渲染倒计时时钟
  that.setData({
    clock: date_format(total_micro_second)
  });
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    if (total_micro_second < 0) {
      return false
    }else{
      count_down(that);
    }
    
  }, 10)
  console.log(total_micro_second)
  
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
  return hr + ":" + min + ":" + sec + " " + micro_sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}


