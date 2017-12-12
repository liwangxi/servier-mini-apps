// pages/nearby-detail/nearby-detail.js
var app = getApp();
Page({
  data: {
    detail: '',
    phone:"",
    mid:"",
    pv:"",
    fabulous:"",
    fabulous1:'',
    nearby_num:"",
    mark:"",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var mid = options.id;
    that.setData({
      mid:mid
    })
    // 存入锁匠id
    wx.setStorage({
      key: mid,
      data: mid,
      success: function (e) {
        console.log(e);
      }
    })
    wx.request({
      url: app.globalData.nearby_detail_url,
      data: {
        id: mid,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (r) {
        console.log(r);
        var detail = r.data.info;
        var phone = detail.phone;
        console.log(detail);
        if (detail.street==null){
          detail.street=""
        }
        var fabulous = r.data.info.fabulous;
        r.data.info.phone = r.data.info.phone.substr(0, 3) + '****' + r.data.info.phone.substr(7);  
        that.setData({
          detail: detail,
          phone:phone,
          fabulous: fabulous,
        })
      }
    })
    wx.request({
      url: app.globalData.pv_url,
      data: {
        id: mid,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (r) {
        var pv = r.data.pv;
        that.setData({
          pv:pv
        })
      }
    }) 
  },
  //点赞
  onLike: function () {
    var that = this;
    //获取缓存nearby_num的值
    wx.getStorage({
      key: "nearby_num",
      success: function (res) {
        console.log(res.data);
        that.setData({
          nearby_num: res.data
        })
      },
    })
    //获取缓存锁匠id的值mark
    wx.getStorage({
      key: that.data.mid,
      success: function (res) {
        console.log(res.data);
        that.setData({
          mark: res.data
        })
        if (that.data.mark == that.data.nearby_num) {
          wx.showModal({
            title: '提示',
            content: '你已经点过赞了',
          })
        } else {
          if (that.data.fabulous1 == that.data.fabulous) {
            wx.showModal({
              title: '提示',
              content: '你已经点过赞了',
            })
            return false;
          } else {
            wx.request({
              url: app.globalData.like_url,
              data: {
                id: that.data.mid,
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: function (r) {

                console.log(r.data)
                var fabulous1 = r.data.fabulous
                that.setData({
                  fabulous: fabulous1,
                  fabulous1: fabulous1,
                })
                wx.setStorage({
                  key: "nearby_num",
                  data: that.data.mid,
                  success: function (e) {
                  }
                })
                wx.showToast({
                  title: '点赞成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
          }
        }
      },
    })
    
    
  },
  /**
   * 用户点击右上角分享
   */
  // 图片预览
  pre_img: function (e) {
    console.log(e.currentTarget.id)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: [e.currentTarget.id], // 需要预览的图片http链接列表
      success: function (res) {
        console.log(res)
      },
    })
  },
  //拨打电话
  onPhone: function (e) {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.phone //仅为示例，并非真实的电话号码
    })
  },
  onShareAppMessage: function () {

  }
})