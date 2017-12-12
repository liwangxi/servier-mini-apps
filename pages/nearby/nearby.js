// pages/nearby/nearby.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: "",
    noNearby: true,
    nearby_con: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showToast({
      icon: "loading",
      title: "数据加载中"
    }),
    wx.getLocation({
      success: function (res) {
        var lat = res.latitude
        var lng = res.longitude
        wx.request({
          url: getApp().globalData.nearby_url,
          method: 'GET',
          data: {
            lat: lat,
            lng: lng,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (r) {
            console.log(r);
            var count = r.data.count;
            console.log(count);
            if (count > 0) {
              var list = r.data.list;
              that.setData({
                list: list,
                noNearby: false,
              });
            } else {
              that.setData({
                noNearby: true,
                nearby_con: "附近2公里内没有锁匠"
              });
            }
          },
          fail: function (r) {
            console.log(r)
            that.setData({
              noNearby: true,
              nearby_con: "附近2公里内没有锁匠"
            });
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onNearbyl: function (e) {
    var mid = e.currentTarget.dataset.mid;
    wx.navigateTo({
      url: 'nearby-detail?id=' + mid,
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    wx.showNavigationBarLoading()//在标题栏中显示加载
    var that = this;
    wx.getLocation({
      success: function (res) {
        var lat1 = res.latitude
        var lng1 = res.longitude
        wx.request({
          url: getApp().globalData.nearby_url,
          method: 'GET',
          data: {
            lat: lat1,
            lng: lng1,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (r) {
            var count = r.data.count;
            console.log(count);
            if (count > 0) {
              var list = r.data.list;
              that.setData({
                list: list,
                noNearby: false,
              });
            } else {
              that.setData({
                noNearby: true,
                nearby_con: "附近2公里内没有锁匠"
              });
            }
          },
          fail: function (r) {
            console.log(r)
            that.setData({
              noNearby: true,
              nearby_con: "附近2公里内没有锁匠"
            });
          },
          complete: function () {
            // complete
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
          }
        })
      }
    })
    
  }
})