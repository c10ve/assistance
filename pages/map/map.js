var app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  data: {
    latitude: 0,//地图初次加载时的纬度坐标
    longitude: 0, //地图初次加载时的经度坐标
    name: "" //选择的位置名称
  },
  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'CKYBZ-5YMCR-R2TWL-WVSUY-3PBN6-K4BTM'
    });

    this.moveToLocation();
  },
  //移动选点
  moveToLocation: function () {
    var that = this;
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2];
    //console.log(prePage);
    wx.chooseLocation({
      success: function (res) {
           console.log(res)
        app.globalData.choose_address = res.name;
        app.globalData.choose_lng = res.longitude;
        app.globalData.choose_lat = res.latitude;
        //选择地点之后返回到原来页面
        if (prePage.route.indexOf("publish") != -1) {
          wx.switchTab({
            url: '../../pages/publish/publish',
            success(res) {
              let page = getCurrentPages().pop()
              if (page == undefined || page == null) {
                return
              }
              page.onLoad()
            }
          })
        }
        else{
          prePage.setData({
            address:res.name
          });
          wx.navigateBack({
            delta: 1
            // success(res) {
            //   let page = getCurrentPages().pop()
            //   if (page == undefined || page == null) {
            //     return
            //   }
            //   page.onLoad()
            // }
          })
        }
      },
      fail: function (err) {
        console.log(err);
        wx.navigateBack({
          success(res) {
            let page = getCurrentPages().pop()
            if (page == undefined || page == null) {
              return
            }
            page.onLoad()
          }
        })
      }
    });
  }
});
