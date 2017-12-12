var app = getApp();
Page({
  data: {
    stars: [0, 1, 2, 3, 4],
    stars1: [0, 1, 2, 3, 4],
    stars2: [0, 1, 2, 3, 4],
    normalSrc: '/pages/images/normal.png',
    selectedSrc: '/pages/images/selected.png',
    key: 5,//评分
    num: 5,
    mid: 5,
    eva_message: "",
    order: "",
    store_info: '',
    phone: '',
    authkey: '',
    order_sn: '',
    other_info: '',
    img1: "../../images/liji.png",
    img2: "../../images/liji.png",
    file_img1: "",
    file_img2: "",
    show: 0,
  },
  onLoad: function (options) {
    var sn = options.order_sn;
    var that = this;
    console.log(sn);
    wx.getStorage({
      key: 'key',
      success: function (res) {
        var key = res.data.authkey;
        that.setData({
          authkey: key,
          order_sn: sn,
        })
        console.log(key);
        wx.request({
          url: app.globalData.order_detail_url,
          data: {
            authkey: key,
            sn: sn,
            type: 1,
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (r) {
            console.log(r);
            var order = r.data.data;
            console.log(order);
            var store_info = r.data.data.store_info;
            var phone = store_info.phone;
            if (phone === null) {
              phone = "4001105100"
            }
            that.setData({
              order: order,
              store_info: store_info,
              phone: phone,
            })
          }
        })
        wx.request({
          url: app.globalData.tag_list_url,
          data: {
            authkey: key,
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data);
            that.setData({
              tag_list: res.data.data
            })
          }
        })
      },
    })
  },
  selectLeft: function (e) {
    var key = e.currentTarget.dataset.key
    var that = this
    if (that.data.key == 1 && e.currentTarget.dataset.key == 1) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    that.setData({
      key: key
    })
  },
  selectLeft1: function (e) {
    var num = e.currentTarget.dataset.num
    var that = this
    if (that.data.num == 1 && e.currentTarget.dataset.num == 1) {
      //只有一颗星的时候,再次点击,变为0颗
      num = 0;
    }
    that.setData({
      num: num
    })
  },
  selectLeft2: function (e) {
    var mid = e.currentTarget.dataset.mid
    var that = this
    if (that.data.mid == 1 && e.currentTarget.dataset.mid == 1) {
      //只有一颗星的时候,再次点击,变为0颗
      mid = 0;
    }
    that.setData({
      mid: mid
    })
  },
  //拨打电话
  onPhone: function (e) {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.phone //仅为示例，并非真实的电话号码
    })
  },
  //获取评价信息
  other_info: function (e) {
    var that = this
    var other_info = e.detail.value
    that.setData({
      other_info: other_info
    })
  },
  //评价接口
  onEvaluate: function (e) {
    console.log(e)
    var that = this;
    if (that.data.other_info == "") {
      wx.showModal({
        title: '提示',
        content: '输入评价内容',
      })
      return false;
    }
    var images_li
    if (that.data.file_img1 == "" && that.data.file_img2 != "") {
      images_li = that.data.file_img2
    } else if (that.data.file_img2 == "" && that.data.file_img1 != "") {
      images_li = that.data.file_img1
    } else if (that.data.file_img2 == "" && that.data.file_img1 == "") {
      images_li = ""
    } else {
      images_li = that.data.file_img1 + "," + that.data.file_img2
    }
    if (that.data.file_img1 != "" && that.data.file_img2 != "") {
      wx.request({
        url: app.globalData.evaluate_url,
        data: {
          authkey: that.data.authkey,
          order_sn: that.data.order_sn,
          content: that.data.other_info,
          speed: that.data.key,
          service: that.data.num,
          professional: that.data.mid,
          comment_tag_id: that.data.show+1,
          img: images_li,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res);
          if (res.data.r === 1) {
            wx.redirectTo({
              url: '../../order/order-detail?&order_sn=' + that.data.order_sn + ''
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提交评价',
        content: '最好上传两张评价图片哦',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.evaluate_url,
              data: {
                authkey: that.data.authkey,
                order_sn: that.data.order_sn,
                content: that.data.other_info,
                speed: that.data.key,
                service: that.data.num,
                professional: that.data.mid,
                comment_tag_id: that.data.show + 1,
                img: images_li,
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res);
                if (res.data.r === 1) {
                  wx.redirectTo({
                    url: '../../order/order-detail?&order_sn=' + that.data.order_sn + ''
                  })
                }
              }
            })
          }
        }
      })
    }

  },
  //标签切换
  onTag:function(e){
    var that=this
    var id = e.currentTarget.dataset.id-1
    console.log(id);
    that.setData({
      show:id
    })
  },
  // 上传服务图片
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
            img1: res.tempFilePaths[0]
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
              console.log(JSON.parse(res.data));
              that.setData({
                file_img1: JSON.parse(res.data).data.url
              })
            }
          }
        })
      }
    })
  },
  // 上传服务图片2
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
            img2: res.tempFilePaths[0]
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
  // 图片预览
  pre_img: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: [e.currentTarget.id], // 需要预览的图片http链接列表
      success: function (res) {
        console.log(res)
      },
    })
  },
})



