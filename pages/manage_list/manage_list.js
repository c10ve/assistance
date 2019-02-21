// pages/me/my_publish/my_publish.js
var app = getApp()
Page({
  data: {
    my_publish: '',
  },
  onShow: function () {
     console.log('app.globalData.uid',app.globalData.uid)
     if (app.globalData.uid == '') {
          wx.showToast({
               title: '请登陆',
               icon: 'none',
               duration: 1500
          });
          setTimeout(() =>
               wx.switchTab({
                    url: '../me/me',
               }), 2000
          )
     }
     else{
          this.setData({
               my_publish: app.globalData.my_publish,
          })
     }   
  },
  postActId: function (e) {
    console.log(e.currentTarget.dataset.actopen)
    app.globalData.actid = e.currentTarget.dataset.actid,
    wx.request({
      url: 'http://localhost:8082/demo/actInfor', // 仅为示例，并非真实的接口地址
      method: 'GET',
      data: {
        'actId': e.currentTarget.dataset.actid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        app.globalData.my_publish_detail = res.data
        wx.navigateTo({
          url: '../manage/manage'
        })
      }
    })
  }
})