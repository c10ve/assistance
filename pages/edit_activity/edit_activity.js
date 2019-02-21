//引用腾讯地图API
var app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    contime_array: ["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6"],

    actname: "",
    date: "2018-09-01",
    start_time: "18:30",
    act_contime: '0.5',
    address: "",
    actnum: 50,
    actintro: "",
    introLength: 0
  },
  onLoad: function (options) {
    this.setData({
      actname: app.globalData.my_edit.actName,
      date: app.globalData.my_edit.actDate,
      start_time: app.globalData.my_edit.actTime,
      act_contime: app.globalData.my_edit.actContime,
      address: app.globalData.my_edit.actAddr,
      actnum: app.globalData.my_edit.actNum,
      actintro: app.globalData.my_edit.actIntro,
      introLength: app.globalData.my_edit.actIntro.length
    })
    var choose_address = app.globalData.choose_address;
    if (choose_address != null && choose_address != '') {
      this.setData({
        address: choose_address,
      })
    }
  },
  // onShow: function() { },
  bindContimeChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      act_contime: this.data.contime_array[e.detail.value]
    })
  },
  bindActName: function (e) {
    this.setData({
      actname: e.detail.value
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
  bindActNum: function (e) {
    //console.log(e.detail.value)
    this.setData({
      actnum: e.detail.value
    })
  },
  bindActIntro: function (e) {
     if (e.detail.value.length <= 150) {
          this.setData({
               actintro: e.detail.value,
               introLength: e.detail.value.length
          })
     }
  },
  
  editActivity: function () {
    if (this.data.address == '') {
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
    else {
      wx.request({
        url: 'http://localhost:8082/demo/updateact', // 仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          'actName': this.data.actname,
          'actDate': this.data.date,
          'actTime': this.data.start_time,
          'actContime': this.data.act_contime,
          'actAddr': this.data.address,
          'actNum': this.data.actnum,
          'actIntro': this.data.actintro,
          'actId': app.globalData.actid,
          'actLng': app.globalData.choose_lng,
          'actLat': app.globalData.choose_lat
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: res => {
          if(res.data==1){
            wx.showToast({
              title: '编辑成功',
              icon: 'success',
              duration: 1500
            });
            //更新更新完的数据
            app.globalData.my_publish_detail.actName = this.data.actname,
            app.globalData.my_publish_detail.actDate = this.data.date,
            app.globalData.my_publish_detail.actTime = this.data.start_time,
            app.globalData.my_publish_detail.actAddr = this.data.address,
            app.globalData.my_publish_detail.actIntro = this.data.actintro,
            app.globalData.my_publish_detail.actNum = this.data.actnum,
            
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
              url: 'http://localhost:8082/demo/actfromrecruit', // 仅为示例，并非真实的接口地址
              method: 'GET',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: res => {
                app.globalData.new_activity = res.data
              }
            })
            setTimeout(()=>
              wx.navigateBack({}),2000
            )
          }
        }
      })
    }

  },
});


