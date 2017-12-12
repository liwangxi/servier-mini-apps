// pages/index/home/order_list.js
var app = getApp();
var api = require("../../utils/api/request.js")
Page({
  data: {
    order_type: '',
    order_list: "",
    authkey: "",
    noNearby: true,
    nearby_con: "",
    show: 0,
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    none: false,
    num: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //订单列表接口
    console.log(1);
    console.log(app.globalData.mobile)
    if (app.globalData.mobile == "") {
      wx.navigateTo({
        url: '../reg/reg?id=1'
      })
    }
    wx.getStorage({
      key: 'key',
      success: function (res) {
        console.log(res);
        var key = res.data.authkey
        that.setData({
          authkey: key
        })
        var order_list_data = { ontype: 1, authkey: key, source: 'weixin' }
        api.http(app.globalData.order_list, order_list_data, that.order_list_fun)
        //订单类型接口
        var order_type_data = { type: 1, authkey: key }
        api.http(app.globalData.order_type, order_type_data, that.order_type_fun)
      }
    })

  },
  order_type_fun: function (all) {
    var that = this
    that.setData({
      order_type: all.data
    })
  },
  order_list_fun: function (all) {
    var that = this
    if (all.count == "0") {
      that.setData({
        none: true
      })
    } else {
      that.setData({
        order_list: all.data,
      })
    }

  },
  //判断点击进入页面
  onSkip: function (e) {
    var that = this
    var sn = e.currentTarget.dataset.sn
    console.log(sn);
    var type = e.currentTarget.dataset.type
    if (type == "待到达") {
      wx.navigateTo({
        url: '/pages/index/home/coming?order_sn=' + sn + ''
      })
    } else if (type == "服务中") {
      wx.navigateTo({
        url: '/pages/index/home/service?order_sn=' + sn
      })
    } else if (type == "待付款") {
      wx.navigateTo({
        url: '/pages/index/home/pay?order_sn=' + sn + ''
      })
    } else if (type == "待评价") {
      wx.navigateTo({
        url: '/pages/index/home/evaluate?order_sn=' + sn + ''
      })
    } else if (type == "已取消") {
      console.log(1);
    } else if (type == "已完成") {
      console.log(1);
      wx.navigateTo({
        url: '/pages/order/order-detail?order_sn=' + sn
      })
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    console.log(1);
    var that = this;
    wx.showNavigationBarLoading()//在标题栏中显示加载
    wx.request({
      url: app.globalData.order_list,
      data: {
        authkey: that.data.authkey,
        type: that.data.num,
        ontype: 1,
        source: "weixin"
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log(res.data)
        that.setData({
          order_list: res.data.data
        })
      },
      complete: function () {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  //订单切换
  onType: function (e) {
    var that = this;
    var num = e.target.dataset.id
    that.setData({
      num: num
    })
    var cid = e.currentTarget.dataset.cid
    wx.showLoading({
      icon: "loading",
      title: "数据加载...",
      mask: true,
    }),
      wx.request({
        url: app.globalData.order_list,
        data: {
          authkey: that.data.authkey,
          type: num,
          ontype: 1,
          page: 1,
          source: "weixin"
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (all) {
          // console.log(all.data.count);
          if (all.data.count == 0) {
            that.setData({
              show: cid,
              type: num,
              order_list: all.data.data,
              searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
              searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
              searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏        
              none: true
            })
          } else {
            that.setData({
              show: cid,
              type: num,
              order_list: all.data.data,
              searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
              searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
              searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏         
              none: false,
            })
          }

          wx.hideLoading()
        },
        fail: function (all) {
          console.log(all);
        }
      });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (!that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,
        searchLoading: true,
      })
      wx.request({
        url: app.globalData.order_list,
        data: {
          type: that.data.type,
          ontype: 1,
          page: that.data.searchPageNum
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (all) {
          console.log(all);
          if (all.data.data == undefined) {
            that.setData({
              searchLoadingComplete: true,
              searchLoading: false,
            })
          } else {
            that.setData({
              searchLoading: false,
              order_list: that.data.order_list.concat(all.data.data)
            })
          }
        },
        fail: function (all) {
          console.log(all);
        }
      });
    } else {
      console.log("加载完成");
    }


  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
  //时间戳转化时间

})