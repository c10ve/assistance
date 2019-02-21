var app = getApp()
Page({
  data: {
    //isShow:true,
    actName: '',
    actPartTime: '',
    actAddr: '',
    actIntro: '',
    actNum: '',
    joinersNum: '',
    stillNeedNum: '',
    //hidden: false,
    actPublishtime: '',
    userName: '',
    userAvatarurl: '',
    joinersList: '',
    joinerConfirm: false,
    hiddenmodalput: true,
    //报名信息
    joinerConnection: '', 
    joinerQQ: '', 
    joinerWechat: '', 
    joinerText: ''
  },
  onShow: function (e) {
    var part_time = app.globalData.my_publish_detail.actDate + ' ' + app.globalData.my_publish_detail.actTime
    this.setData({
      actName: app.globalData.my_publish_detail.actName,
      actPartTime: part_time,
      actAddr: app.globalData.my_publish_detail.actAddr,
      actIntro: app.globalData.my_publish_detail.actIntro,
      actNum: app.globalData.my_publish_detail.actNum,
      joinersNum: app.globalData.my_publish_detail.joinersNum,
      actPublishtime: app.globalData.my_publish_detail.actPublishtime,
      stillNeedNum: app.globalData.my_publish_detail.stillNeedNum,
      userName: app.globalData.my_publish_detail.userName,
      userAvatarurl: app.globalData.my_publish_detail.userAvatarurl,
      joinersList: app.globalData.my_publish_detail.joinersList,
      joinerConfirm: app.globalData.my_publish_detail.joinerConfirm==0?false:true,
      
    })
  },
  onLoad: function (e) {
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2].route;
    if (prePage.indexOf("my_participate") != -1 || prePage.indexOf("my_publish") != -1){
       this.setData({
         hidden: true
       });
    };
    //获取参与者信息
     //   var that = this
     //   wx.request({
     //        url: 'http://localhost:8082/demo/display', // 仅为示例，并非真实的接口地址
     //        method: 'GET',
     //        data: {
     //             'actId': app.globalData.actid,
     //             'userId': app.globalData.uid,
     //        },
     //        header: {
     //             'content-type': 'application/x-www-form-urlencoded' // 默认值
     //        },
     //        success(res) {
     //           app.globalData.joiner = res.data 
     //        }
     //   })  
    
  },
  /* 转发*/
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '活动分享',
      path: 'pages/activity_detail/activity_detail',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        //可以获取群组信息
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            console.log("res:" + res)
          }
        })
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  joinActivity: function (e) {
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
          var that = this
          wx.request({
               url: 'http://localhost:8082/demo/joinact', // 仅为示例，并非真实的接口地址
               method: 'POST',
               data: {
                    'actId': app.globalData.actid,
                    'userId': app.globalData.uid,
                    'userName': this.data.userName, 
                    'userAvatarurl': this.data.userAvatarurl,
                    'joinerConnection': this.data.joinerConnection, 
                    'joinerQQ': this.data.joinerQQ, 
                    'joinerWechat': this.data.joinerWechat, 
                    'joinerText': this.data.joinerText
               },
               header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
               },
               success: res =>{
                    //console.log(res.data)
                    if (res.data == 1) {
                         wx.showToast({
                              title: '参加成功',
                              icon: 'success',
                              duration: 2000
                         });
                         that.setData({
                              joinersNum: ++this.data.joinersNum,
                              stillNeedNum: --this.data.stillNeedNum,
                              joinerConfirm: true,
                              hiddenmodalput: true          
                         })
                         //this.onShow();
                    }
                    
                    else {
                         wx.showToast({
                              title: '您已参加该活动',
                              icon: 'none',
                              duration: 2000
                         });
                    }
               },
               // fail:res=>{
               //      that.setData({
               //           hidden: true
               //      })
               // }
          })
     }
    
  },
  quitActivity: function (e) {
     var that = this     
     wx.request({
          url: 'http://localhost:8082/demo/quitact', // 仅为示例，并非真实的接口地址
          method: 'GET',
          data: {
               'actId': app.globalData.actid,
               'userId': app.globalData.uid,
               // 'userName': app.globalData.userName, 
               // 'userAvatarurl': app.globalData.userAvatarurl
          },
          header: {
               'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success:res=> {
               //console.log(res.data)
               if (res.data == 1) {
                    wx.showToast({
                         title: '退出成功',
                         icon: 'success',
                         duration: 2000
                    });
                    that.setData({
                         joinersNum: --this.data.joinersNum,
                         stillNeedNum: ++this.data.stillNeedNum,
                         joinerConfirm: false
                    })
               }
               // else {
               //      that.setData({
               //           hidden: true
               //      })
               // }
          },
          // fail: res => {
          //      that.setData({
          //           hidden: true
          //      })
          // }
       })
     },
     modalinput: function () {
          this.setData({
               hiddenmodalput: !this.data.hiddenmodalput
          })
     },
//取消按钮  
     cancel: function () {
          this.setData({
               hiddenmodalput: true
          });
     },
     //确认  
     
     bindQQ: function (e) {
          //console.log(e.detail.value)
          this.setData({
               joinerQQ: e.detail.value
          })
     },
     bindWX: function (e) {
          this.setData({
               joinerWechat: e.detail.value
          })
     },
     bindTel: function (e) {
          this.setData({
               joinerConnection: e.detail.value
          })
     },
     bindText: function (e) {
          this.setData({
               joinerText: e.detail.value
          })
     },
     joiner: function (e) {
          wx.navigateTo({
               url: '../../pages/joiner/joiner',
          })
     },
});