var app = getApp()
Page({
  data:{
    actName: '',
    actPartTime: '',
    actAddr: '',
    actIntro: '',
    actNum: '',
    joinersNum: '',
    actPublishtime: '',
    joinersList: '',
    stillNeedNum: '',
    actOpen: false,
    actRecruit: false
  },
  onShow: function (e) {
    //console.log(app.globalData.my_publish_detail)
    var part_time = app.globalData.my_publish_detail.actDate + ' ' + app.globalData.my_publish_detail.actTime
    this.setData({
      actName: app.globalData.my_publish_detail.actName,
      actPartTime: part_time,
      actAddr: app.globalData.my_publish_detail.actAddr,
      actIntro: app.globalData.my_publish_detail.actIntro,
      actNum: app.globalData.my_publish_detail.actNum,
      joinersNum: app.globalData.my_publish_detail.joinersNum,
      stillNeedNum: app.globalData.my_publish_detail.stillNeedNum,
      joinersList: app.globalData.my_publish_detail.joinersList,
      actPublishtime: app.globalData.my_publish_detail.actPublishtime,
      actOpen: app.globalData.my_publish_detail.actOpen == 0 ? true : false,
      actRecruit: app.globalData.my_publish_detail.actRecruit == 1 ? true : false
      //publish_date: '',
    })
  },
openCancel: function () {
    var that = this
    wx.showModal({
      content: '您是否要取消活动',
      confirmText: "是",
      cancelText: "否",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          wx.request({
            url: 'http://localhost:8082/demo/actopen', // 仅为示例，并非真实的接口地址
            method: 'GET',
            data: {
              'actId': app.globalData.actid,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success(res) {
              if (res.data == 1) {
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 1500
                })
                wx.request({
                  url: 'http://localhost:8082/demo/actfromrecruit', // 仅为示例，并非真实的接口地址
                  method: 'GET',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  success: res => {
                    app.globalData.new_activity = res.data
                  }
                })
                wx.request({
                    url: 'http://localhost:8082/demo/published', // 仅为示例，并非真实的接口地址
                    method: 'GET',
                    data: {
                         'userId': app.globalData.uid,
                    },
                    header: {
                         'content-type': 'application/x-www-form-urlencoded' // 默认值
                    },
                    success: res => {
                         if (res.data) {
                              app.globalData.my_publish = res.data
                         }
                    }
               })
                that.setData({
                  actOpen:true,
                  actRecruit: true
                })
              }
              else{
                wx.showToast({
                  title: '取消失败',
                  icon: 'none',
                  duration: 1500
                });
              }
            }
          })
        } else {
          console.log('用户点击否')
        }
      }
    });
  },
  beforeUpdate: function(){
    wx.request({
      url: 'http://localhost:8082/demo/beforeupdate', // 仅为示例，并非真实的接口地址
      method: 'GET',
      data: {
        'actId': app.globalData.actid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        app.globalData.my_edit = res.data
        wx.navigateTo({
          url: '../edit_activity/edit_activity' 
        })
      }
    })
  },
  bindRecruit: function () {
    var that = this
    wx.showModal({
      content: '您是否要招募',
      confirmText: "是",
      cancelText: "否",
      success: function (res) {
        //console.log(res);
        if (res.confirm) {
          wx.request({
            url: 'http://localhost:8082/demo/recruit', // 仅为示例，并非真实的接口地址
            method: 'GET',
            data: {
              'actId': app.globalData.actid,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success(res) {
              if (res.data == 1) {
                wx.showToast({
                  title: '招募成功',
                  icon: 'success',
                  duration: 1500
                });
                wx.request({
                  url: 'http://localhost:8082/demo/actfromrecruit', // 仅为示例，并非真实的接口地址
                  method: 'GET',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  success: res => {
                    app.globalData.new_activity = res.data
                  }
                })
                // wx.request({
                //   url: 'http://localhost:8082/demo/actInfor', // 仅为示例，并非真实的接口地址
                //   method: 'GET',
                //   data: {
                //     'actId': app.globalData.actid,
                //   },
                //   header: {
                //     'content-type': 'application/x-www-form-urlencoded' // 默认值
                //   },
                //   success(res) {
                //     console.log('res.data',res.data)
                //     app.globalData.my_publish_detail = res.data
                //   }
                // })
                that.setData({
                  //actOpen: true,
                  actRecruit: true
                })
              }
              else {
                wx.showToast({
                  title: '招募失败',
                  icon: 'none',
                  duration: 1500
                });
              }
            }
          })
        } else {
          console.log('用户点击否')
        }
      }
    });
    
     },
     joiner: function (e) {
          
          wx.navigateTo({
               url: '../../pages/joiner/joiner',
          })
     },
});