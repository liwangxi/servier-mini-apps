// pages/reg/reg.js
var app = getApp();
var phoneCode = null;
var phoneNum = null;
// 7c8eS5fSGrqronT0APjTggrOBk5VhXf6_5g0g42J
Page({
  data: {
    verifyInfo: '获取验证码',
    isdisable: false,
    phoneNum: "",
    phoneCode: "",
    authkey: "",
  },
  onLoad: function () {

  },
  input_mobile: function (e) {
    var that = this
    phoneNum = e.detail.value;
    console.log(phoneNum);
    that.setData({
      phoneNum: phoneNum
    })
  },
  input_code: function (e) {
    var that = this
    phoneCode = e.detail.value;
    console.log(phoneCode)
    that.setData({
      phoneCode: phoneCode
    })
  },
  //获取验证码
  onCode: function (event) {
    var that = this
    console.log(phoneNum)
    var count = 60;
    var re = /^1[3|4|5|7|8|9][0-9]\d{4,8}$/;
    if (!re.test(phoneNum)) {
        wx.showModal({
            title: "请输入正确的手机号"
        });
        return false;
    } else {
    wx.showModal({
      title: "发送成功"
    });
    wx.request({
      url: app.globalData.yan_url + "?mobile=" + that.data.phoneNum,
      method: "POST",
      dataType: "json",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
      },
    })
    var timer = setInterval(function () {
      count--;
      if (count >= 1) {
        that.setData({
          verifyInfo: '重新获取' + count + 's',
          isdisable: true,
        })
      } else {
        that.setData({
          verifyInfo: '获取验证码',
          isdisable: false,
        })
        clearInterval(timer);
      }
    }, 1000);
    }

  },
  onPlace: function () {
    var that = this;
    var number_phone = parseInt(that.data.phoneNum);
    var number_vcode = that.data.phoneCode;
    console.log(number_vcode)
    // 调用缓存数据
    wx.getStorage({
      key: 'key',
      success: function (res) {
        var authkey = res.data.authkey;
        console.log(authkey);
        that.setData({
          authkey: authkey
        })
      }
    })
    if (number_vcode == "" || number_vcode == null) {
        wx.showModal({
            title: '提示',
            content: '请输入验证码',
        })
    } else {
    wx.request({
      url: app.globalData.reg_url+'?mobile=' + number_phone + '&vcode=' + number_vcode + '',
      method: "POST",
      dataType: "json",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var authkey = encodeURIComponent(that.data.authkey)
        if (res.data.r === 0) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
        if (res.data.r == 1) {
          wx.request({
            url: 'https://houtai.zgjsgf.com/api/api.user.update.php?type=4&name=mobile&param=' + number_phone + '&authkey=' + authkey + '',
            method: "POST",
            dataType: "json",
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res);
              if (res.data.r == 2) {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  success: function (res) {
                    if (res.confirm) {
                      getApp().getUserInfo(function (e) { })
                    }
                  }
                })
              } else if (res.data.r == 1) {
                wx.showToast({
                  title: '验证手机号成功',
                  icon: 'success',
                  duration: 500
                })            
                app.globalData.mobile = that.data.phoneNum
                console.log(app.globalData.mobile)
                wx.navigateBack({
                  delta: 1
                })
              }
            },
          })
        }
      },
    })
    }
  },
})