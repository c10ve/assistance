//引用腾讯地图API
var app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    contime_array: ["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6"],

    address: "",
    date: "2018-09-01",
    start_time:"18:30",
    act_contime: '0.5',
    actname: '',
    actnum: 50,
    actintro: '',
    userName: '',
    userAvatarurl: '',
    actJoinedSelf: 0,
    introLength: 0,
  },
  onLoad: function (options) {
    var choose_address = app.globalData.choose_address;
    if (choose_address != null && choose_address != '') {
      this.setData({
        address: choose_address,
      })
    }
    var that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              //console.log(res.userInfo)
              that.setData({
                   userName: res.userInfo.nickName,
                   userAvatarurl: res.userInfo.avatarUrl,                  
              })
              app.globalData.userName = res.userInfo.nickName
              app.globalData.userAvatarurl = res.userInfo.avatarUrl
              //this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }}
     })
  },
  bindContimeChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      //index: e.detail.value,
      act_contime: this.data.contime_array[e.detail.value]
    })
  },
  bindActName:function(e){
    this.setData({
      actname:e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindStartTimeChange: function (e) {
    this.setData({
      start_time: e.detail.value
    })
  },
  bindActNum: function(e){
    this.setData({
      actnum:e.detail.value
    })
  },
  bindActIntro:function(e){
     if (e.detail.value.length<=150){
          this.setData({
               actintro: e.detail.value,
               introLength: e.detail.value.length
          })
     }
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length,
      actJoinedSelf: 1
    })
  },
  postActivity:function(){
    if (app.globalData.uid==''){
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
    else if (this.data.address == '') {
      wx.showModal({
        content: '请选择地址',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }
    else if (this.data.actname == '') {
      wx.showModal({
        content: '请填写活动名',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }
    else if (this.data.actintro == '') {
      wx.showModal({
        content: '请填写活动说明',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }
    else{
      wx.request({
        url: 'http://localhost:8082/demo/pub', // 仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          'actName': this.data.actname,
          'actIntro': this.data.actintro,
          'actAddr': this.data.address,
          'actDate': this.data.date,
          'actTime': this.data.start_time,
          'actContime': this.data.act_contime,
          'userId': app.globalData.uid,
          'userName': this.data.userName,
          'userAvatarurl': this.data.userAvatarurl,
          'actNum': this.data.actnum,
          'actJoinedSelf': this.data.actJoinedSelf,
          'actLng': app.globalData.choose_lng,
          'actLat': app.globalData.choose_lat
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: res => {
          if (res.data==1){
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 1500
            })
            this.setData({
               address: "",
               date: "2018-09-01",
               start_time: "18:30",
               act_contime: '0.5',
               actname: "",
               actnum: 50,
               actintro: "",
               actJoinedSelf: 0,
               isAgree:false
            })
            wx.request({
              url: 'http://localhost:8082/demo/actfromrecruit', // 仅为示例，并非真实的接口地址
              method: 'GET',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: res => {
                   console.log(res.data)
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
          }
          else{
            wx.showToast({
              title: '发布失败',
              icon: 'success',
              duration: 1500
            });
            
          }
        }
      })
    }
  },
});


