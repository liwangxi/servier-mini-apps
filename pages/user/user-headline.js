// pages/user/user-headline.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:true,
    my_list:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getStorage({
      key: 'key',
      success: function (res) {
        console.log(res);
        var all = res.data;
        var key = all.authkey
        wx.request({
          url: app.globalData.my_news,
          data: {
            authkey: key
          },
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (all) {
            console.log(all.data.list);
            if(all.data.list=="null"){
              that.setData({
                isShow:false
              })
            }else{
              that.setData({
                my_list: all.data.list,
                isShow:true
              })
            } 
            
          }
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    
    //5大链接栏目接口
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})