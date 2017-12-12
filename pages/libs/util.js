function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽  
  var originalHeight = e.detail.height;//图片原始高  
  var originalScale = originalHeight / originalWidth;//图片高宽比  
  //获取屏幕宽高  
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight / windowWidth;//屏幕高宽比  
      var Scale = originalWidth / windowWidth
      imageSize.imageWidth = windowWidth
      imageSize.imageHeight = originalHeight / Scale;
    }
  })
  return imageSize;
}
 
//时间转化为时间戳
function getDate() {
  getApp().getUserInfo(function (e) { })
  var date = new Date();
  var seperator1 = "-";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
  return currentdate;
}
// 时间格式转化时间戳
function get_unix_time(dateStr) {
  var newstr = dateStr.replace(/-/g, '/');
  var date = new Date(newstr);
  var time_str = date.getTime().toString();
  return time_str.substr(0, 10);
}
//时间格式转换
function getLocalTime(nS) {
  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ")
}
module.exports = {
  imageUtil: imageUtil,
  getDate:getDate,
  get_unix_time: get_unix_time,
  getLocalTime: getLocalTime
} 