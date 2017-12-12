
var app = getApp();
var amapFile = require('../libs/amap-wx.js');
Page({
  data: {
    result: [],
    banner: [],
    city: '定位中...',
    column: [],
    lock_list: [],
    user_list: [],
    list: [],
  },
  onLoad: function () {
    var that = this
    //获取城市定位
    wx.getLocation({
      success: function (res) {
        console.log(res);
        var lat = res.latitude
        var lng = res.longitude
        that.setData({
          lat: lat,
          lng: lng
        })
        var myAmapFun = new amapFile.AMapWX({ key: '2c28742121c4f1ecaefb4015e297100d' });
        myAmapFun.getRegeo({
          success: function (res) {
            var city_map = res[0].regeocodeData.addressComponent.city;
            console.log(city_map);
            // 切割地区end
            that.setData({
              city: city_map,
            });
          },
          fail: function (info) {
            //失败回调
            console.log(info)
          }
        })
      }
    })
    //5大链接栏目接口
    wx.request({
      url: app.globalData.column_url,
      data: {
        type: '1'
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all.data.data);
        that.setData({
          column: all.data.data
        })
      }
    });
    //服务类型接口
    wx.request({
      url: app.globalData.lock_type_url,
      data: {
        type: '1'
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all.data.data);
        that.setData({
          lock_type: all.data.data
        })
      }
    });
    //用户最新订单接口
    wx.request({
      url: app.globalData.user_now_url,
      header: {
        'content-type': 'application/json'
      },
      data: {
        type: 1,
      },
      method: "GET",
      success: function (all) {
        console.log(all.data.data);
        that.setData({
          user_list: all.data.data
        })
      }
    });
    //锁匠最新接单接口
    wx.request({
      url: app.globalData.lock_now_url,
      header: {
        'content-type': 'application/json'
      },
      data: {
        type: 1,
      },
      method: "GET",
      success: function (all) {
        console.log(all);
        that.setData({
          lock_list: all.data.data,
        })
      }
    });
    //banner接口
    wx.request({
      url: app.globalData.banner_url,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        var banner = all.data.list;
        console.log(banner);
        that.setData({
          banner: banner,
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(1);
    // wx.hideLoading()
  },
  //签到接口
  mall: function (e) {
    var that = this
    //5大链接栏目接口
    wx.request({
      url: app.globalData.mall_sign,
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
        wx.showToast({
          title: all.data.msg,
          icon: 'success',
          duration: 2000
        })
      }
    });
  },
  //点击进入注册须知页面
  onReg: function (event) {
    wx.navigateTo({
      url: '/pages/firm/firm-list',
    })
  },
  //点击进入合作企业
  onJoin: function (event) {
    wx.navigateTo({
      url: '../join/join-list',
    })
  },
  //点击进入多多客服页面
  onKe: function (event) {
    wx.navigateTo({
      url: '../kefu/kefu-list',
    })
  },
  //点击进入开锁页面
  onLock: function (event) {
    var postId = event.currentTarget.id;
    wx.navigateTo({
      url: 'home/home-service?id=' + postId,
    })
  },
  //点击进入新闻
  onNews: function (event) {
    wx.navigateTo({
      url: '/pages/news/news',
    })
  },
  //点击进入积分商城
  onShop: function (event) {
    wx.navigateTo({
      url: '/pages/shop/shop-index',
    })
  }
})
