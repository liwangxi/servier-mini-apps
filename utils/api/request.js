function http(url,data,callBack) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    data:data,
    success: function (res) {
      callBack(res.data);
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

module.exports = {
  http: http
}