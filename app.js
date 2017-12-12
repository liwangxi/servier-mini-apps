var app = getApp();
App({
  onLaunch: function () {
    var that = this;
    wx.getStorage({
      key: 'key',
      success: function (res) {
        // 在缓存中取authkey
        var authkey = res.data;
        if (authkey == "") {
          that.getUserInfo(function (e) { });
        } else {
          return false
        }
      },
      fail: function (e) {
        that.getUserInfo(function (e) { });
      }
    })
  },
  // 登录获取authkey值
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res_login) {
          var code = res_login.code
          wx.getUserInfo({
            success: function (res) {
              var encryptedData = encodeURIComponent(res.encryptedData);
              var iv = res.iv;
              that.globalData.userInfo = res.userInfo
              wx.request({
                url: "https://houtai.zgjsgf.com/api/api.login.index.php",
                data: {
                  code: code,
                  iv: iv,
                  encryptedData: encryptedData,
                  source: 'SmallProgram',
                },
                method: "POST",
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (all) {
                  console.log(all.data);
                  var res_data = all.data;
                  if (res_data.r == 0) {
                    wx.showModal({
                      title: '授权失败',
                      content: '请点击确认键重新授权',
                      success: function (res) {
                        if (res.confirm) {
                          that.getUserInfo(function (e) { });
                        }
                      }
                    })
                  }
                  that.globalData.userInfo = res_data;
                  console.log(res_data);
                  that.globalData.openId = res_data.userInfo.openId
                  that.globalData.mobile = res_data.userInfo.mobile
                  //   缓存到本地
                  wx.setStorage({
                    key: "key",
                    data: res_data //缓存的数据
                  })
                }
              })
              // 登录信息
              typeof cb == "function" && cb(that.globalData.userInfo)
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
          })

        },

      });
    }
  },
  globalData: {
    userInfo: "",//用户信息
    openId:"",
    mobile:"",
    column_url: "https://houtai.zgjsgf.com/api/api.server.index_nav.php",//首页5大栏目接口
    lock_type_url: "https://houtai.zgjsgf.com/api/api.server.index_server.php",//服务类型接口
    banner_url: 'https://houtai.zgjsgf.com/api/api.server.get_banner.php',//首页轮播接口
    user_now_url: 'https://houtai.zgjsgf.com/api/api.server.index_user_order.php',//用户及时订单展示接口
    lock_now_url: 'https://houtai.zgjsgf.com/api/api.server.index_store_order.php',//锁匠接单展示接口
    join_hand: "https://houtai.zgjsgf.com/api/api.server.cooperation_banner.php",//合作企业banner接口
    join_hand_logo: "https://houtai.zgjsgf.com/api/api.server.index_server.php",//合作企业logo接口
    join_hand_detail: "https://houtai.zgjsgf.com/api/api.server.cooperation_detail.php",//合作企业详情接口
    reg_banner: "https://houtai.zgjsgf.com/api/api.server.register_banner.php?type=1",//注册banner接口
    news_type: "https://houtai.zgjsgf.com/api/api.server.news_type.php",//新闻类型接口
    my_news:"https://houtai.zgjsgf.com/api/api.user.my_news_list.php",//我的头条
    news_list: "https://houtai.zgjsgf.com/api/api.server.news_list.php",//新闻列表接口
    news_detail: "https://houtai.zgjsgf.com/api/api.server.news_detail.php",//新闻详情接口
    news_like: "https://houtai.zgjsgf.com/api/api.server.news_is_liked.php",//新闻点击喜欢接口
    news_review: "https://houtai.zgjsgf.com/api/api.server.news_comment_list.php",//新闻评论列表接口
    news_review_liked: "https://houtai.zgjsgf.com/api/api.server.comment_is_liked.php",//新闻评论点赞接口
    news_review_push: "https://houtai.zgjsgf.com/api/api.server.comment_publish.php",//新闻发表评论接口
    cooperation_banner: "https://houtai.zgjsgf.com/api/api.server.cooperation_banner.php",//合作企业banner接口
    cooperation_logo: "https://houtai.zgjsgf.com/api/api.server.cooperation_logo.php",//合作企业logo接口
    cooperation_detail: "https://houtai.zgjsgf.com/api/api.server.cooperation_detail.php",//合作企业详情接口
    customer_service: "https://houtai.zgjsgf.com/api/api.server.customer_service.php",//客服图片和电话接口
    customer_problem: "https://houtai.zgjsgf.com/api/api.server.customer_problem.php",//客服问题详情接口
    customer_feedback: "https://houtai.zgjsgf.com/api/api.server.customer_feedback.php",//用户提交反馈建议接口
    mall_product_detail: "https://houtai.zgjsgf.com/api/api.server.mall_product_detail.php",//商品详情接口
    mall_user: "https://houtai.zgjsgf.com/api/api.server.mall_user.php",//商城首页用户信息接口
    mall_product_list: "https://houtai.zgjsgf.com/api/api.server.mall_product_list.php",//商品列表信息
    mall_everydaytask: "https://houtai.zgjsgf.com/api/api.server.mall_everydaytask.php",//每日任务列表接口
    mall_sign:"https://houtai.zgjsgf.com/api/api.server.mall_sign.php",//每日签到接口
    mall_share:"https://houtai.zgjsgf.com/api/api.server.mall_share.php",//每日分享接口
    mall_pre_order:"https://houtai.zgjsgf.com/api/api.server.mall_pre_order.php",//积分商城订单详情接口
    wx_payfee:"https://houtai.zgjsgf.com/api/wx.payfee.php",//提交订单
    mall_payment:"https://houtai.zgjsgf.com/api/api.server.mall_payment.php",//收入支出接口
    register_check_phone:"https://houtai.zgjsgf.com/api/api.server.register_check_phone.php",//注册验证手机号码
    register_store:"https://houtai.zgjsgf.com/api/api.server.register_store.php",//锁匠注册接口
    register_manufactor:"https://houtai.zgjsgf.com/api/api.server.register_manufactor.php",//企业注册接口
    store_info:"https://houtai.zgjsgf.com/api/api.server.register_store_info.php",//锁匠注册完善信息接口
    register_manufactor_info:"https://houtai.zgjsgf.com/api/api.server.register_manufactor_info.php",//企业注册完善信息接口
    type_det_url: 'https://houtai.zgjsgf.com/api/api.server.order_type_det.php',//下单小类服务详情接口
    isOrder_url:'https://houtai.zgjsgf.com/api/api.server.check_old_order.php',//检测是否有正在进行的订单
    advance_charge_url:'https://houtai.zgjsgf.com/api/api.order.order_advance_charge.php',//下单预付款接口
    advance_success_url:'https://houtai.zgjsgf.com/api/api.order.order_advance_charge_success.php',//预付款成功接口
    user_order_pay_url:'https://houtai.zgjsgf.com/api/api.order.user_order_pay.php',//订单支付生成支付记录接口
    order_pay_success_url:'https://houtai.zgjsgf.com/api/api.order.user_order_pay_success.php',//订单支付成功接口
    denglu_url: 'https://houtai.zgjsgf.com/api/api.login.index.php',//获取用户authkey接口
    yan_url: 'https://houtai.zgjsgf.com/api/api.sms.index.php',//获取验证码接口
    reg_url: 'https://houtai.zgjsgf.com/api/api.sms.check.php',//验证手机接口
    goods_lock_url: 'https://houtai.zgjsgf.com/api/api.server.get_good_store.php',//首页优质锁匠接口
    map_url: 'https://restapi.amap.com/v3/geocode/regeo?location=',//高德地图接口
    upload_url: 'https://houtai.zgjsgf.com/api/api.upload.index.php',//上传图片接口
    list_url: 'https://houtai.zgjsgf.com/api/api.uorder.add.php',//创建订单接口
    call_lock_url: 'https://houtai.zgjsgf.com/api/api.order.new_match_store.php',//呼叫锁匠
    list_lock_url: 'https://houtai.zgjsgf.com/api/api.order.check_match.php',//监听是否接单接口
    list_order_url: 'https://houtai.zgjsgf.com/api/api.uorder.delivery.php',//监听订单状态接口
    cancel_url: 'https://houtai.zgjsgf.com/api/api.uorder.cancel.php',//取消订单接口
    order_type: "https://houtai.zgjsgf.com/api/api.order.order_status.php",//订单类型接口
    order_list: "https://houtai.zgjsgf.com/api/api.order.list.php",//订单列表接口
    order_detail_url: "https://houtai.zgjsgf.com/api/api.order.detail.php",//订单详情接口
    evaluate_url: 'https://houtai.zgjsgf.com/api/api.uorder.comment.php',//评价订单接口
    tag_list_url:'https://houtai.zgjsgf.com//api/api.order.get_comment_tag_list.php',//获取标签接口
    firm_url: "https://houtai.zgjsgf.com/api/api.server.get_company.php",//优秀企业接口
    nearby_url: "https://houtai.zgjsgf.com/api/api.server.get_nearby.php",//附近接口
    nearby_detail_url: "https://houtai.zgjsgf.com/api/api.server.get_nearby_info.php",//附近详情锁匠接口
    firm_detail_url: "https://houtai.zgjsgf.com/api/api.server.get_company_info.php",
    my_collection:"https://houtai.zgjsgf.com/api/api.user.my_collection.php",
    like_url: "https://houtai.zgjsgf.com/api/api.server.nearby_store_fabulous.php",//附近锁匠的点赞
    pv_url: "https://houtai.zgjsgf.com/api/api.server.nearby_store_pv.php",//附近锁匠访问量
    firm_pv_url: "https://houtai.zgjsgf.com/api/api.server.company_pv.php",//优质企业访问量
    firm_like_url: "https://houtai.zgjsgf.com/api/api.server.company_fabulous.php",//优质企业点赞量
  },
  onShareAppMessage: function () {

  }
})