var app=getApp()
Page({
  data: {
    banner_list:'',
    logo_list:''
  },
  onLoad:function(){
    var that=this
    //合作企业banner接口
    wx.request({
      url: app.globalData.cooperation_banner,
      data: {
        type: '1',
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        that.setData({
          banner_list:all.data.data
        })
      }
    })
    //合作企业logo接口
    wx.request({
      url: app.globalData.cooperation_logo,
      data: {
        type: '1',
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (all) {
        console.log(all);
        that.setData({
          logo_list: all.data.data
        })
      }
    })
  },
  onClick: function (e) {
    var id = e.currentTarget.id
    console.log(id);
    wx.navigateTo({
      url: 'join-firm?id=' + id,
    })
  },
  onReg:function(e){
    wx.navigateTo({
      url: '/pages/lockReg/qiye1',
    })
  },
  
  onPhone:function(){
    wx.makePhoneCall({
      phoneNumber: '4001105100' //仅为示例，并非真实的电话号码
    })
  },
  
})