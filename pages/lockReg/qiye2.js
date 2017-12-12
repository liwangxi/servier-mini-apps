// pages/lockReg/lockReag2.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    license: "../images/upload-img.png",
    authorization: "../images/upload-img.png",
    region: ['广东省', '深圳市', '南山区'],
    name: "",
    phone: "",
    email: "",
    province: "广东省",
    city: "深圳市",
    area: "南山区",
    address: "",
    license_code:"",
    file_img1:"",
    file_img2:"",
    authkey:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
  },
  //获取到地址
  bindRegionChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      region: e.detail.value,
      province: e.detail.value[0],
      city: e.detail.value[1],
      area: e.detail.value[2],
    })
  },
  //获取到公司名称
  bindName: function (e) {
    this.setData({
      name: e.detail.value,
    })
  },
  //获取到联系电话
  bindPhone: function (e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  //获取到电子邮箱
  bindEmail: function (e) {
    this.setData({
      email: e.detail.value,
    })
  },
  //获取到详细地址
  bindAddress: function (e) {
    this.setData({
      address: e.detail.value,
    })
  },
  //获取到营业执照号
  bindLicense: function (e) {
    this.setData({
      license_code: e.detail.value,
    })
  },
  onStep: function (e) {
    var that = this;
    console.log(that.data.name);
    if (that.data.name == "" || that.data.phone == "" || that.data.email == "" || that.data.province == "" || that.data.address == "" || that.data.license_code==""||that.data.file_img1==""||that.data.file_img2=="") {
      wx.showToast({
        title: '请完整填写信息',
        icon: 'loading',
        duration: 1000
      })
      return false;
    }
    var re = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
    if (!re.test(that.data.phone)) {
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'loading',
        duration: 1000
      })
      return false;
    }
    var re1 = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (!re1.test(that.data.email)) {
      wx.showToast({
        title: '邮箱格式错误',
        icon: 'loading',
        duration: 1000
      })
      return false;
    }
    wx.request({
      url: app.globalData.register_manufactor_info,
      method: "GET",
      data: {
        type: 1,
        name:that.data.name,
        phone:that.data.phone,
        email:that.data.email,
        province:that.data.province,
        city:that.data.city,
        area:that.data.area,
        address:that.data.address,
        license:that.data.license,
        authorization: that.data.authorization,
        license_code: that.data.license_code,
        authkey: app.globalData.userInfo.authkey,
      },
      dataType: "json",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.r==1){
          wx.navigateTo({
            url: 'qiye3',
          })
        }
      }
    })

  },
  // 上传营业执照正本
  teke_photo: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        }),

          that.setData({
            license: res.tempFilePaths[0]
          })
        wx.uploadFile({
          url: app.globalData.upload_url,
          filePath: res.tempFilePaths[0],
          name: 'upfile',
          formData: {
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.statusCode != 200) {
              wx.showModal({
                title: '提示',
                content: '上传失败'
              })
            } else {
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 1000
              })
              that.setData({
                file_img1: JSON.parse(res.data).data.url
              })

            }
          }
        })
      }
    })
  },
  // 上传公司授权书
  teke_photo1: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        }),

          that.setData({
            authorization: res.tempFilePaths[0]
          })
        wx.uploadFile({
          url: app.globalData.upload_url,
          filePath: res.tempFilePaths[0],
          name: 'upfile',
          formData: {
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.statusCode != 200) {
              wx.showModal({
                title: '提示',
                content: '上传失败'
              })
            } else {
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 1000
              })
              that.setData({
                file_img2: JSON.parse(res.data).data.url
              })
            }
          }
        })
      }
    })
  },
})