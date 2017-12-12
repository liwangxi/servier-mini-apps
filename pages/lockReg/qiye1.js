// pages/reg/reg.js
var app = getApp();
var phoneCode;
var phoneNum;
var password1;
var password2;
// 7c8eS5fSGrqronT0APjTggrOBk5VhXf6_5g0g42J
Page({
  data: {
    verifyInfo: '获取验证码',
    isdisable: false,
    phoneNum: "",
    phoneCode: "",
    password1: "",
    password2: "",
    authkey:"",
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
    that.setData({
      phoneCode: phoneCode
    })
  },
  //获取验证码
  onCode: function (event) {
    var that = this
    console.log(that.data.phoneNum);
    var count = 60;
    var re = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
    if (!re.test(phoneNum)) {
      wx.showModal({
        title: "请输入正确的手机号"
      });
      return false;
    } else {
      wx.request({
        url: app.globalData.register_check_phone,
        method: "GET",
        data: {
          type: 1,
          tel: that.data.phoneNum,
          authkey: app.globalData.userInfo.authkey,   
        },
        dataType: "json",
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(that.data.phoneNum);
          console.log(res);
          if (res.data.r == 1) {
            wx.request({
              url: app.globalData.yan_url + "?mobile=" + that.data.phoneNum,

              method: "POST",
              dataType: "json",
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                // console.log(that.data.phoneNum)
                // console.log(res)
                if (res.data.r == 1) {
                  wx.showToast({
                    title: "发送成功",
                    icon: 'success',
                  });
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
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: "loading"
                  })
                }
              },
            })
          } else {
            wx.showModal({
              title: res.data.msg
            });
          }

        },
        fail: function (res) {
          wx.showModal({
            title: "获取验证码失败"
          });
        }
      })
    }
  },
  //获取输入密码值
  onPassword1: function (e) {
    var that = this;
    password1 = e.detail.value;
    that.setData({
      password1: password1
    })
  },
  onPassword2: function (e) {
    var that = this;
    password2 = e.detail.value;
    if (that.data.password1 == "") {
      wx.showModal({
        title: "请先输入密码",
      })
    } else if (that.data.password1.length < 6) {
      wx.showModal({
        title: "密码不得小于6位数",
      })
    }
    that.setData({
      password2: password2
    })
  },
  //下一步
  onStep: function (e) {
    var that = this;
    if (that.data.phone == "" || that.data.phoneCode=="" ||that.data.password1==""){
      wx.showModal({
        title: '请填写完整数据'
      })
      return false;
    }
if (that.data.password1 == that.data.password2) {
  wx.request({
    url: app.globalData.register_manufactor,
    method: "GET",
    data: {
      type: 1,
      tel: that.data.phoneNum,
      password: that.data.password1,
      vcode: that.data.phoneCode,
      authkey: app.globalData.userInfo.authkey
    },
    dataType: "json",
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      switch (res.data.r) {
        case 1:
          wx.navigateTo({
            url: 'qiye2?id=' + res.data.mid,
          })
          break
        case 2:
          wx.showModal({
            title: "验证码错误请重新输入",
          })
          break
        case 3:
          wx.showModal({
            title: "注册失败",
          })
          break
        case 4:
          wx.showModal({
            title: "该用户已注册过锁匠",
          })
          break
      }
    }
  })
} else {
  wx.showModal({
    title: "两次密码输入不一致"
  });
}
  },
})