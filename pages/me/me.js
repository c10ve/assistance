const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    my_publish: []
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    this.login()
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  postuid: function (e) {
     if (app.globalData.uid != ''){
          if (e.currentTarget.dataset.mark == 'publish') {
               wx.request({
                    url: 'http://localhost:8082/demo/published', // 仅为示例，并非真实的接口地址
                    method: 'GET',
                    data: {
                         'userId': app.globalData.uid,
                    },
                    header: {
                         'content-type': 'application/x-www-form-urlencoded' // 默认值
                    },
                    success(res) {
                         app.globalData.my_publish = res.data
                         wx.navigateTo({
                              url: '../my_publish/my_publish'
                         })
                    }
               })
          }
          else {
               wx.request({
                    url: 'http://localhost:8082/demo/joinedact', // 仅为示例，并非真实的接口地址
                    method: 'GET',
                    data: {
                         'userId': app.globalData.uid,
                    },
                    header: {
                         'content-type': 'application/x-www-form-urlencoded' // 默认值
                    },
                    success(res) {
                         app.globalData.my_participate = res.data
                         wx.navigateTo({
                              url: '../my_participate/my_participate'
                         })
                    }
               })
          }
     }
     else{
          wx.showToast({
               title: '请登陆',
               icon: 'none',
               duration: 1500
          });
     }
    
  },
  login: function () {
       
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('code:', res.code)
        wx.request({
          //获取openid接口  
          url: 'http://localhost:8082/demo/decodeUserInfo',
          method: 'POST',
          data: {
            'code': res.code,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: res => { 
            app.globalData.uid = res.data.openid
            console.log('uid', app.globalData.uid)
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

            wx.request({
               url: 'http://localhost:8082/demo/joinedact', // 仅为示例，并非真实的接口地址
               method: 'GET',
               data: {
                    'userId': app.globalData.uid,
               },
               header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
               },
               success: res => {
                    if (res.data) {
                         app.globalData.my_participate = res.data
                    }
                    
               }
            })
          }
        })
       }
      })
    }
})
