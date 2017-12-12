var app = getApp();
// 时间选择
var amapFile = require('../../libs/amap-wx.js');
var util = require('../../libs/util.js');
const date = new Date()
const img_len = []
Page({
  data: {
    adress_name: "定位中...",
    call_baoge: "",
    zhuan: true,
    yuyue: true,
    waiting_img: true,
    img1: "../../images/upload-img-1.png",
    img2: "../../images/upload-img-1.png",
    file_img1: "",
    file_img2: "",
    haspicker: false,
    yuyuetime: "现在",
    date: util.getDate(),
    time: '10:00',
    other_info: "",
    province: "",
    city: "",
    area: "",
    street: "",
    address_info: "",
    door: "",
    lat: "",
    lng: "",
    phone_number: "",
    name: "",
    phone: "",
    order_sn: "",
    ismake: 0,
    make_starttime: "",
    locktype: "",
    typeName: "",
    authkey: "",
    call_baoge:"",
    lock_baoge:"",
    timer1:"",
    time_next:120,
    t:0,
  },
  //定位信息
  onLoad: function (options) {
    var that = this;
    var locktype = options.id;
    var typeName = options.typeName;
    that.setData({
      locktype: locktype,
      typeName: typeName,
    })
    wx.getStorage({
      key: 'key',
      success: function (res) {
        var all = res.data;
        var key = all.authkey
        that.setData({
          authkey: key
        })
      }
    })
    wx.getLocation({
      success: function (res) {
        console.log(res);
        var lat = res.latitude
        var lng = res.longitude
        that.setData({
          lat: lat,
          lng: lng
        })
        var myAmapFun = new amapFile.AMapWX({ key: '2c28742121c4f1ecaefb4015e297100d' });
        myAmapFun.getRegeo({
          success: function (res) {
            var province_map = res[0].regeocodeData.addressComponent.province;
            console.log(province_map);
            var city_map = res[0].regeocodeData.addressComponent.city;
            var district_map = res[0].regeocodeData.addressComponent.district;
            // 获取街道
            var street = res[0].regeocodeData.addressComponent.township
            // 切割地区
            var adress_map = res[0].regeocodeData.formatted_address;
            var split_location = adress_map.split(district_map)
            var adress_clearly = split_location[1]
            // 切割地区end
            that.setData({
              province: province_map,
              city: city_map,
              district: district_map,
              adress: adress_map,
              adress_name: adress_clearly,
              street: street,
            });
          },
          fail: function (info) {
            //失败回调
            console.log(info)
          }
        })
      }
    })
  },
  //联系人姓名
  onName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //联系电话
  onPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //获取地址
  choosemap: function (e) {
    var that = this;
    wx.chooseLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res);
        var lat = res.latitude
        var lng = res.longitude
        var address = res.address
        var name = res.name
        that.setData({
          lat: lat,
          lng: lng,
          adress_name: name,
        });
        wx.request({
          url: 'https://restapi.amap.com/v3/geocode/regeo?location=' + that.data.lng + ',' + that.data.lat + '&key=c5ebca3c444ea869e94f68b25c3b34fe&s=rsv3&rf=h5&utm_source=litemap',
          method: "GET",
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res);
            var province_map = res.data.regeocode.addressComponent.province;
            var city_map = res.data.regeocode.addressComponent.city;
            var district_map = res.data.regeocode.addressComponent.district;
            // 获取街道
            var street = res.data.regeocode.addressComponent.township
            // 切割地区
            var adress_map = res.data.regeocode.formatted_address;
            var split_location = adress_map.split(street)
            var adress_clearly = split_location[1]
            that.setData({
              province: province_map,
              city: city_map,
              district: district_map,
              adress: adress_map,
              adress_name: adress_clearly,
              street: street,
            });
          },
          fail: function (res) {
            console.log(res);
          }
        })
      }
    })
  },
  // 获取详情信息门牌号
  bindChange_door: function (e) {
    var that = this
    var door = e.detail.value;
    that.setData({
      door: door
    })
  },
  // 预约
  switch1Change: function (e) {
    var that = this
    if (that.data.yuyue) {
      that.setData({
        yuyue: false,
        yuyuetime: "预约",
        haspicker: true,
        ismake: 1,
      })
    } else {
      that.setData({
        yuyue: true,
        yuyuetime: "现在",
        haspicker: false,
        ismake: 0,
      })
    }
  },
  //获取日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //获取时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  // 简略描述信息
  other_info: function (e) {
    var other_info = e.detail.value
    this.setData({
      other_info: other_info
    })
  },
  // 上传图片1
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
              // that.data.img_li.push(JSON.parse(res.data).data.url);
              // console.log(JSON.parse(res.data))
              that.setData({
                file_img1: JSON.parse(res.data).data.url
              })
            }
          }
        })
      }
    })
  },
  // 上传图片2
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
              // that.data.img_li.push(JSON.parse(res.data).data.url);
              that.setData({
                file_img2: JSON.parse(res.data).data.url
              })
            }
          }
        })
      }
    })
  },
  //下单按钮
  rotate: function (e) {
    var that = this
    console.log(app.globalData.mobile);
    if (app.globalData.phone == "") {
      wx.navigateTo({
        url: '../../reg/reg?id=1'
      })
    } else {
      var re = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
      if (!re.test(that.data.phone)) {
        wx.showModal({
          content: "请填写正确的手机号码"
        });
        return false;
      }
      if (that.data.name == "") {
        wx.showModal({
          content: "请填写联系人姓名"
        });
        return false;
      }
      if (that.data.door == "") {
        wx.showModal({
          content: "请具体门牌号"
        });
        return false;
      }
      if (that.data.other_info == "") {
        wx.showModal({
          content: "请填备注信息"
        });
        return false;
      }
      if (that.data.file_img1 != "" && that.data.file_img2 != "") {
        that.onPay()
      } else {
        wx.showModal({
          title: '确认下单',
          content: '有问题图片上传不完整',
          success: function (res) {
            if (res.confirm) {
              that.onPay()
            } else if (res.cancel) {
              console.log(res.cancel)
            }
          }
        })
      }

    }
  },
  //下单预支付
  onPay: function (e) {
    var that = this;
    wx.showModal({
      title: "预支付",
      content: "先缴纳20元的预付款",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.advance_charge_url,
            data: {
              type: 1,
              authkey: that.data.authkey,
              openid: app.globalData.openId,
            },
            header: {
              'content-type': 'application/json'
            },
            method: "GET",
            success: function (res) {
              console.log(res);
              var pay_sn = res.data.sn;
              if (res.data.r == 1) {
                wx.requestPayment({
                  'timeStamp': res.data.data.timeStamp,
                  'nonceStr': res.data.data.nonceStr,
                  'package': res.data.data.package,
                  'signType': 'MD5',
                  'paySign': res.data.data.sign,
                  'success': function (res) {
                    wx.request({
                      url: app.globalData.advance_success_url,
                      data: {
                        authkey: that.data.authkey,
                        status: 1,
                        pay_type: 1,
                        sn: pay_sn,
                      },
                      header: {
                        'content-type': 'application/json'
                      },
                      method: "GET",
                      success: function (res) {
                        console.log(res.data.sn)
                        that.setData({
                          order_sn: res.data.sn
                        })
                        that.onPlace();
                      }
                    })

                  },
                  'fail': function (res) {
                    wx.showModal({
                      content: '生成订单失败',

                    })
                  }
                })
              }
            }, fail: function (all) {
              console.log(all);
            }
          })
        } else if (res.cancel) {
          return false
        }
      }
    });
  },
  //下单函数
  onPlace: function () {
    console.log(1);
    var that = this
    //生成订单
    if (that.data.ismake == 1) {
      var make_time = that.data.date + " " + that.data.time
      var make_starttime = util.get_unix_time(make_time)
    } else {
      make_starttime = ""
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
    wx.request({
      url: app.globalData.list_url,
      data: {
        authkey: that.data.authkey,
        username: that.data.name,//姓名
        mobile: that.data.phone,//联系电话
        province: that.data.province,//省
        city: that.data.city,//市
        area: that.data.district,//区
        street: that.data.street,//街道
        address_info: that.data.address_info,//具体地址
        address: that.data.door,//门牌号
        longitude: that.data.lng,//经度
        latitude: that.data.lat,//纬度
        type: that.data.locktype,//开锁类型
        ismake: that.data.ismake,//是否预约
        other_info: that.data.other_info,//备注信息
        make_starttime: make_starttime,
        images: images_li,
        sn: that.data.order_sn
      },
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.r == 1) {
          //监听是否派单
          that.setData({
            zhuan: false,
            waiting_img: true,
          })
          that.data.call_baoge = setInterval(function () {
            wx.request({
              url: app.globalData.call_lock_url,
              data: {
                authkey: that.data.authkey,
                order_sn: that.data.order_sn,
              },
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (all) {
                console.log(all);
                if (all.data.r == 1) {
                  clearInterval(that.data.call_baoge)
                  that.data.lock_baoge = setInterval(function () {
                    wx.request({
                      url: app.globalData.list_lock_url,
                      data: {
                        authkey: that.data.authkey,
                        sn: that.data.order_sn,
                      },
                      header: {
                        'content-type': 'application/json'
                      },
                      method: "GET",
                      success: function (all) {
                        console.log(all);
                        if (all.data.r == 1) {
                          clearInterval(that.data.lock_baoge);
                          wx.reLaunch({
                            url: 'coming?&order_sn=' + that.data.order_sn + ''
                          })
                        }
                      }
                    })
                  }, 2000)
                } else if (all.data.r == 0) {
                  clearInterval(that.data.call_baoge)
                  wx.showModal({
                    title: '提示',
                    content: "匹配锁匠失败",
                    success: function (res) {
                      if (res.confirm) {
                        clearInterval(that.data.lock_baoge);
                        clearInterval(that.data.timer1);
                        wx.redirectTo({
                          url: '/pages/index/index'
                        })
                      }
                    }
                  });
                }
              }
            });
          }, 2000)
        } else if (res.data.r == 0) {
          clearInterval(that.data.call_baoge)
          return false
        }
      },
    })
    var t=0
    that.data.server=setInterval(function(){
      t+=1;
      that.setData({
        t:t
      })
      if(t==20){
        clearInterval(that.data.server)
      }
    },2000)
    var n = 120;
    that.data.timer1 = setInterval(function () {
      n -= 1;
      that.setData({
        time_next: n
      })
      if (n == 0) {
        that.setData({
          zhuan: false,
          waiting_img: false,
          time_next: 120,
        })
        clearInterval(that.data.call_baoge)
        clearInterval(that.data.lock_baoge);
        clearInterval(that.data.timer1);
      }
    }, 1000);
  },
  //取消订单
  // cancel_order: function (e) {
  //   var that = this;
  //   that.setData({
  //     is_not: true,
  //   })
  // },
  //取消
  // close_cancel: function (e) {
  //   var that = this;
  //   that.setData({
  //     is_not: false,
  //   })
  // },
  //确认取消
  // sure_cancel: function (e) {
  //   var that = this;
  //   clearInterval(that.call_baoge())
  //   clearInterval(that.lock_baoge());
  //   clearInterval(that.timer1());
  //   wx.request({
  //     url: app.globalData.cancel_url,
  //     data: {
  //       authkey: that.data.authkey,
  //       sn: that.data.order_sn,
  //     },
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     method: "GET",
  //     success: function (res) {
  //       console.log(res)
  //       if (res.data.r == 1) {
  //         wx.navigateTo({
  //           url: "home"
  //         })
  //       }
  //     }
  //   });
  //   that.setData({
  //     is_not: false,
  //     time_next: 120,
  //     call_baoge: false
  //   })
  // },
})