var app = getApp()
Page({
  data: {
    my_participate: '',
  },
  onShow: function () {
    this.setData({
      my_participate: app.globalData.my_participate,
    })
  },
  postActId: function (e) {
    wx.request({
      url: 'http://localhost:8082/demo/actinfo', // 仅为示例，并非真实的接口地址
      method: 'GET',
      data: {
        'actId': e.currentTarget.dataset.actid,
        'userId': app.globalData.uid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        app.globalData.my_publish_detail = res.data
        wx.navigateTo({
          url: '../activity_detail/activity_detail'
        })
      }
    })
  }
})