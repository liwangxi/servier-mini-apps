// pages/index/home/order-detail.js
var app = getApp();
function getLocalTime(nS) {
  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ")
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '/pages/images/normal.png',
    selectedSrc: '/pages/images/selected.png',
    serive: '',
    reach: '',
    major: '',//评分
    eva_message: "",
    order: [],
    info: [],
    overdue_time: "",
    star_time: "",
    phone: "",
    iscom: false,
    isInfo: true,
    onInsmake: false,
    yu_time: "",

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sn = options.order_sn;
    var that = this;
    wx.request({
      url: app.globalData.order_detail_url,
      data: {
        sn: sn,
        ontype: 1,
        type:1,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (r) {
        var order = r.data.data;
        var order_info = r.data.data.store_info;
        var ismake = r.data.data.ismake
        if (ismake === "1") {
          var onInsmake = true;
          var yu_time = getLocalTime(r.data.data.make_starttime)
          console.log(onInsmake);
        }
        if (order_info == null) {
          var isInfo = false
          that.setData({
            isInfo: isInfo,
            phone: "4001105100",
          })
        } else {
          var phone = r.data.data.store_info.phone
        }
        var star_time = getLocalTime(r.data.data.system_time);
        var overdue_time = getLocalTime(r.data.data.overdue_time);
        var address_info = r.data.data.address_info
        var iscomment = r.data.data.iscomment
        if (iscomment == "1") {
          var iscom = true;
          var serive = order.comment_info.professional
          var reach = order.comment_info.service
          var major = order.comment_info.speed
          that.setData({
            iscom: iscom,
            serive: serive,
            reach: reach,
            major: major,
          })
        }
        if (address_info == "null") {
          address_info = ""
        }

        that.setData({
          order: order,
          info: order_info,
          star_time: star_time,
          overdue_time: overdue_time,
          phone: phone,
          onInsmake: onInsmake,
          yu_time: yu_time,
        })
      }
    })
  },
  onPhone: function (e) {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.phone //仅为示例，并非真实的电话号码
    })
  },
  onStep:function(e){
    wx.navigateTo({
      url: 'order',
    })
  },
  // 图片预览
  pre_img: function (e) {
    var that = this;
    console.log(e.currentTarget.id)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: that.data.img_order, // 需要预览的图片http链接列表
      success: function (res) {
        console.log(res)
      },
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})