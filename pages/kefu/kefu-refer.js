// pages/kefu/kefu-refer.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    content:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  bindTitle:function(e){
    var that=this;
    that.setData({
      title: e.detail.value
    })
  },
  bindCentent:function(e){
    var that = this;
    that.setData({
      content: e.detail.value
    })
  },
  onSuggest:function(){
    var that=this
    if(that.data.content==""){
      wx.showModal({
        title: '提示',
        content: '请输入内容',
      })
      return
    }else{
      // 轮播图片
      wx.request({
        url: app.globalData.customer_feedback,
        header: {
          'content-type': 'application/json'
        },
        data:{
          type:1,
          title:that.data.title,
          text:that.data.text
        },
        method: "GET",
        success: function (all) {
          console.log(all);
          wx.navigateTo({
            url: 'kefu-success',
          })
        }
      });
    }
    
  }
})