var app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    new_activity: '',
    inputShowed: false,
    inputVal: "",
    search_activity: []
  },
  //事件处理函数
  onShow: function () {
    this.setData({
      new_activity: app.globalData.new_activity,
    })
    //console.log(this.data.new_activity)
  },
  open: function () {
    var that = this
    wx.showActionSheet({
      itemList: ['按时间排序', '按报名人数排序'],
      success: function (res) {
        if (!res.cancel) {
          if(!res.tapIndex){
            //按时间
            // that.setData({
            //   new_activity: app.globalData.new_activity,
            // })
            that.sortByDate()
          }
          else{
            //按人数
            that.sortByNum()
          }
        }
      }
    });
  },
  postActId: function (e) {
    app.globalData.actid = e.currentTarget.dataset.actid
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
        //console.log('my_publish_detail',res.data)
        app.globalData.my_publish_detail = res.data
        wx.navigateTo({
          url: '../activity_detail/activity_detail'
        })
      }
    })
  },
  sortByNum: function(){
    var arr1 = [];   //actnum排序前
    var arr2 = [];   //下标
    var arr3 = [];   //整体排序后
    for (var i = 0; i < this.data.new_activity.length; i++){
      arr1[i] = this.data.new_activity[i].actNum
      arr2[i] = i
    }
    //降序排序
    var temp1,temp2;
    for (var i = 0; i < arr1.length; i++) {
      for (var j = 0; j < arr1.length - i - 1; j++) {
        if (arr1[j] < arr1[j + 1]) {
          //数值交换
          temp1 = arr1[j];
          arr1[j] = arr1[j + 1];
          arr1[j + 1] = temp1;

          //下标交换
          temp2 = arr2[j];
          arr2[j] = arr2[j + 1];
          arr2[j + 1] = temp2;
        }
      }
    };
    // console.log(arr1)
    // console.log(arr2)
    for (var i = 0; i < this.data.new_activity.length; i++) {
      arr3[i] = this.data.new_activity[arr2[i]]
    }
    //console.log(arr3)
    this.setData({
      new_activity: arr3,
    })

    app.globalData.new_activity = arr3
  },
  sortByDate: function () {
    var arr1 = [];   //actnum排序前
    var arr2 = [];   //下标
    var arr3 = [];   //整体排序后
    for (var i = 0; i < this.data.new_activity.length; i++) {
      arr1[i] = this.data.new_activity[i].actdate + ' ' + this.data.new_activity[i].actTime
      arr2[i] = i
    }
    //降序排序
    var temp1, temp2;
    for (var i = 0; i < arr1.length; i++) {
      for (var j = 0; j < arr1.length - i - 1; j++) {
        if (arr1[j] < arr1[j + 1]) {
          //数值交换
          temp1 = arr1[j];
          arr1[j] = arr1[j + 1];
          arr1[j + 1] = temp1;

          //下标交换
          temp2 = arr2[j];
          arr2[j] = arr2[j + 1];
          arr2[j + 1] = temp2;
        }
      }
    };
    //console.log(arr1)
    //console.log(arr2)
    for (var i = 0; i < this.data.new_activity.length; i++) {
      arr3[i] = this.data.new_activity[arr2[i]]
    }
    //console.log(arr3)
    this.setData({
      new_activity: arr3,
    })
    app.globalData.new_activity = arr3
     },
     showInput: function () {
          this.setData({
               inputShowed: true
          });
     },
     hideInput: function () {
          this.setData({
               inputVal: "",
               inputShowed: false,
               new_activity: app.globalData.new_activity,
          });
     },
     clearInput: function () {
          this.setData({
               inputVal: ""
          });
     },
     inputTyping: function (e) {
          this.setData({
               inputVal: e.detail.value
          });
     },
     search:function(){
          //console.log(this.data.new_activity)
          var arr1 = [];
          arr1 = this.data.new_activity
          for (var i = 0,j=0; i < arr1.length; i++){
               if (this.data.inputVal == arr1[i].actName){
                    this.data.search_activity[j] = arr1[i];
                    j++;
               }  
          }
          this.setData({
               new_activity: this.data.search_activity
          })
          //this.data.new_activity = this.data.search_activity
          console.log(this.data.new_activity)
     }
});


