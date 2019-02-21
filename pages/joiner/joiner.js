const app = getApp()
Page({
     data: {
          grids: '',
          hiddenmodalput: true,
     },
     onShow: function (e) {
          //console.log('joinersList:',app.globalData.my_publish_detail.joinersList)
          this.setData({
               grids: app.globalData.my_publish_detail.joinersList
          }) 
     },
     showInfo: function (e) {
          this.setData({
               hiddenmodalput: !this.data.hiddenmodalput
          })
     },
     confirm: function (e) {
          this.setData({
               hiddenmodalput: true
          })
     }     
});