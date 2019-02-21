const app = getApp()
Page({

     /**
      * 页面的初始数据
      */
     data: {
          latitude: '',
          longitude: '',
          markers: [],
          mapWidth: '',
          mapHeight: ''
     },
     toaddress: function (e) {
          //console.log(e)
          var id = e.markerId
          app.globalData.actid = id
          //console.log(id)
          //console.log(this.data.markers)
          // wx.openLocation({
          //   latitude: this.data.markers[id].latitude,
          //   longitude: this.data.markers[id].longitude,
          // })
          wx.request({
               url: 'http://localhost:8082/demo/actinfo', // 仅为示例，并非真实的接口地址
               method: 'GET',
               data: {
                    'actId': id,
                    'userId': app.globalData.uid
               },
               header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
               },
               success(res) {
                    //console.log('my_publish_detail', res.data)
                    app.globalData.my_publish_detail = res.data
                    wx.navigateTo({
                         url: '../activity_detail/activity_detail'
                    })
               }
          })
          
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          var that = this
          wx.getLocation({
               type: 'wgs84',
               success: function (res) {
                   console.log(res.latitude, res.longitude) 
                   that.setData({
                        latitude: res.latitude,
                        longitude: res.longitude
                   })
               },
               fail: function (res) {
                    console.log(res);
               }
          })
          
          var sy = wx.getSystemInfoSync(),
               mapWidth = sy.windowWidth * 2,
               mapHeight = sy.windowHeight * 2;
          this.setData({
               mapWidth: mapWidth,
               mapHeight: mapHeight
          })
          wx.request({
               url: 'http://localhost:8082/demo/location', // 仅为示例，并非真实的接口地址
               method: 'GET',
               data: {
                    'actLng': this.data.longitude,
                    'actLat': this.data.latitude
               },
               header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
               },
               success(res) {
                    console.log('res',res)
                    var location = []
                    for(var i=0;i<res.data.length;i++){
                         location.push({
                              id: res.data[i].actId,
                              latitude: res.data[i].actLat,
                              longitude: res.data[i].actLng,
                              iconPath: '../../res/icons/ic_position.png',
                              alpha: 0.5,
                              width: '30px',
                              height: '30px',
                              //zIndex: 0,
                              label : {
                                   content: res.data[i].actName,
                                   padding: 12,
                                   //display: 'ALWAYS',
                                   textAlign: 'center',
                                   //borderRadius: 50,
                                   borderWidth: '2px',
                                   borderColor: '#999999',
                                   bgColor: "#ffffff",
                                   //anchorY: 150
                              },
                         })

                    }
                    that.setData({
                         markers: location
                    })     

               }
          })
     },
     tap1:function(){
          var that = this
          wx.getLocation({
               type: 'wgs84',
               success: function (res) {
                    console.log(res.latitude, res.longitude)
                    that.setData({
                         latitude: res.latitude,
                         longitude: res.longitude
                    })
               },
               fail: function (res) {
                    console.log(res);
               }
          })
     }
})