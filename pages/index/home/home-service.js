
var app = getApp();
Page({
  data: {
    banner: [],
    type_det_list: "",
    type_det_img: "",
    authkey: "",
  },
  onLoad: function (options) {
    wx.getStorage({
      key: 'key',
      success: function (res) {
        console.log(res);
        var all = res.data;
        var key = all.authkey
        that.setData({
          authkey: key
        })
      }
    })
    var that = this;
    var id = options.id
    //banner接口
    wx.request({
      url: app.globalData.banner_url,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        var banner = all.data.list;
        that.setData({
          banner: banner,
        })
      }
    });
    //服务小类接口
    wx.request({
      url: app.globalData.type_det_url,
      header: {
        'content-type': 'application/json'
      },
      data: {
        type_id: id,
      },
      method: "GET",
      success: function (res) {
        console.log(res)
        that.setData({
          type_det_list: res.data.list,
          type_det_img: res.data.imgs
        })
      }
    });
  },
  //点击进入填写信息页面
  onForm: function (event) {
    var that = this
    var id = event.currentTarget.dataset.id
    var typeName = event.currentTarget.dataset.name
    console.log(id)
    //判断是否还有订单
    wx.request({
      url: app.globalData.isOrder_url,
      header: {
        'content-type': 'application/json'
      },
      data: {
        authkey: that.data.authkey
      },
      method: "GET",
      success: function (res) {
        var old_sn = res.data.order_sn
        if (res.data.r == 0) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: 'coming?&order_sn=' + old_sn
                })
              }
            }
          });
        } else {
          wx.navigateTo({
            url: 'home?id=' + id + '&typeName=' + typeName,
          })
        }
      }
    });
  },
})
