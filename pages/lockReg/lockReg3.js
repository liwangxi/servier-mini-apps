// pages/lockReg/lockReg3.js
var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    card_images: "../images/upload-img.png",
    card_images1: "../images/upload-img.png",
    logo: "../images/upload-img.png",
    card:"",
    true_name:"",
    file_img1:"",
    file_img2:"",
    file_img3:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  // 请上传法人身份证的正面照
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
          console.log(res.tempFilePaths[0])
          that.setData({
            card_images: res.tempFilePaths[0]
          })
        wx.uploadFile({
          url: app.globalData.upload_url,
          filePath: res.tempFilePaths[0],
          name: 'upfile',
          method:'GET',
          formData: {
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res);
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
  // 请上传法人身份证的反面照
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
            card_images1: res.tempFilePaths[0]
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
            console.log(res);
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
  // 请上传头像
  teke_photo2: function (e) {
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
            logo: res.tempFilePaths[0]
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
                file_img3: JSON.parse(res.data).data.url
              })

            }
          }
        })
      }
    })
  },
  //获取到姓名
  bindTrueName: function (e) {
    this.setData({
      true_name: e.detail.value,
    })
  },
  //获取到身份证
  bindCard: function (e) {
    this.setData({
      card: e.detail.value,
    })
  },
  //下一步
  onStep: function (e) {
    var that = this;
    if (that.data.true_name == "" || that.data.card == "" || that.data.file_img1 == "" || that.data.file_img2 == "" || that.data.file_img3 == ""){
      wx.showToast({
        title: '请完整填写信息',
        duration: 1000
      })
      return false;
    }
    wx.request({
      url: app.globalData.store_info,
      method: "GET",
      data: {
        type: 1,
        true_name:that.data.true_name,
        card_images: that.data.file_img1,
        card_images1: that.data.file_img2,
        header: that.data.file_img3,
        authkey: app.globalData.userInfo.authkey
      },
      dataType: "json",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.r == 1) {
          wx.redirectTo({
            url: 'lockReg4',
          })
        }
      }
    })

  },
})