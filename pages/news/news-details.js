// pages/news/new-details.js
var app=getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({
  /** 
   * 页面的初始数据
   */
  data: {
    news_det:"",
    news_review:[],
    id:'',
    is_like:'',
    is_like1:'',
    liked:"",
    content:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id
    var that=this
    that.setData({
      id:id
    })
    //新闻详情接口
    wx.request({
      url: app.globalData.news_detail,
      data: {
        type: '1',
        id:id,
        authkey: app.globalData.userInfo.authkey,
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all.data.data);
        that.setData({
          news_det: all.data.data,
          is_like: all.data.data.is_like,
          liked:all.data.data.liked
        })
        var article = all.data.data.text
        WxParse.wxParse('article', 'html', article, that, 5);
      }
    });
    //新闻评论列表接口
    wx.request({
      url: app.globalData.news_review,
      data: {
        type: '1',
        id: id,
        page:"",
        authkey: app.globalData.userInfo.authkey,
        
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all.data.data);
        that.setData({
          news_review: all.data.data,
        })
      }
    })
    
  },
  //新闻点赞功能
  onLike:function(){
    var that=this
    wx.request({
      url: app.globalData.news_like,
      data: {
        type: '1',
        id: that.data.id,
        is_like: that.data.is_like,
        authkey: app.globalData.userInfo.authkey,
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all);
        that.setData({
          is_like:all.data.is_like,
          liked: all.data.number
        })
      }
    })
  },
  //新闻评论点赞功能
  onLike1: function (e) {
    var that = this
    var cid = e.currentTarget.dataset.cid
    var is_like1 = e.currentTarget.dataset.like
    var len = e.currentTarget.dataset.len
    console.log(is_like1);
    wx.request({
      url: app.globalData.news_review_liked,
      data: {
        type: 1,
        id: cid,
        is_like: is_like1,
        authkey: app.globalData.userInfo.authkey,
        
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all);
        console.log(len);
        var review_now=that.data.news_review;
        review_now[len].is_like=all.data.is_like;
        review_now[len].count = all.data.count;
        console.log(review_now);
        that.setData({
          news_review:review_now
        })
        console.log(that.data.news_review[len].is_like);
      }
    })
  },
  bindReview:function(e){
    var that=this
    that.setData({
      content: e.detail.value
    })
    console.log(e.detail.value);
  },
  //点击评论
  onReview:function(e){
    var that = this
    wx.request({
      url: app.globalData.news_review_push,
      data: {
        type: 1,
        id: that.data.id,
        comment: that.data.content,
        authkey: app.globalData.userInfo.authkey,        
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all);
        wx.redirectTo({
          url: 'news-details?id=' + that.data.id
        })
      }
    })
  },
  //转发
  // onShare:function(e){
  //   wx.showShareMenu({
  //     withShareTicket: true
  //   })
  // },
  onShareAppMessage: function () {
  
  }
})