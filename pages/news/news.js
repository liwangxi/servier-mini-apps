// pages/news/new.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    news_type: "",
    news_list: [],//放置返回数据的数组  
    type: "",//放置新闻类型id
    show: -1,
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //新闻类别接口
    wx.request({
      url: app.globalData.news_type,
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
          news_type: all.data.data
        })
      }
    });
    //新闻列表接口
    wx.request({
      url: app.globalData.news_list,
      data: {
        type: 1,
        page: that.data.searchPageNum,
        authkey: app.globalData.userInfo.authkey,

      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all);
        that.setData({
          news_list: all.data.data
        })

      }
    });
  },
  //新闻类型切换
  onType: function (e) {
    var that = this;
    var num = e.target.dataset.id - 1
    console.log(num);
    that.setData({
      show: num,
      type: num + 1,
      searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
    })
    wx.showLoading({
      icon: "loading",
      title: "数据加载...",
      mask: true,
    }),
    wx.request({
      url: app.globalData.news_list,
      data: {
        type: 1,
        news_type: num + 1,
        page: that.data.searchPageNum,
        authkey: app.globalData.userInfo.authkey,

      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        wx.hideLoading()
        that.setData({
          searchLoading: false,
          news_list: all.data.data
        })
      },
      fail: function (all) {
        console.log(all);
      }
    });
  },
  onNews: function (e) {
    var id = e.currentTarget.id
    console.log(id);
    wx.navigateTo({
      url: 'news-details?id='+id,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  
  onReachBottom: function () {
    var that = this;
    console.log(1);
    if (!that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,
        searchLoading: true,
      })
      wx.request({
        url: app.globalData.news_list,
        data: {
          type: 1,
          news_type: that.data.type,
          page: that.data.searchPageNum,
          authkey: app.globalData.userInfo.authkey,

        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (all) {
          console.log(that.data.news_list);
          console.log(all.data.data);
          that.data.news_list.concat()
          if (all.data.data == undefined) {
            that.setData({
              searchLoadingComplete: true,
              searchLoading: false,
            })
          } else {
            that.setData({
              searchLoading: false,
              news_list: that.data.news_list.concat(all.data.data)
            })
          }

          // that.setData({
          //   news_list: all.data.data
          // })

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
})