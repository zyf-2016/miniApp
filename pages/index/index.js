// pages/video/video.js
const app = getApp()
const { getOpenId, getmedialist } = require('../../static/js/api.js')
Page({
  data: {
    currentIndex: 0,
    videoList: [],
    imageList: [],
    height: 0
  },

  onLoad: function (options) {
    wx.login({
      success: (res) => {
        console.log(res.code)
        getOpenId({
          code: res.code
        }).then(data => {
          console.log('data',data)
          wx.setStorageSync('token', data.data.token)
          wx.setStorageSync('openid', data.data.openid)
          this.getVideoList(data.data.openid)
          this.getImageList(data.data.openid)
        })
      }
    })
    this.setData({
      height: `calc(100vh - ${app.globalData.navbarHeight}px - 290rpx)`
    })
  },
  goback() {
    wx.navigateBack()
  },
  scan() {
    wx.scanCode({
      success(res) {
        console.log(res)
        if(res.path) {
          wx.redirectTo({
            url: '/'+res.path
          })
        }
      }
    })
  },
  tabChange(e) {
    if(e.target.dataset.index == this.data.currentIndex) return
    this.setData({
      currentIndex: parseInt(e.target.dataset.index)
    })
    // this.initList()
  },
  getVideoList(openid) {
    getmedialist({
      openid,
      centent: '宣誓留念'
    }).then(res => {
      res.data.map(item => {
        item.week = item.uploadtime.split('+')[0]
        item.date = item.uploadtime.split('+')[1]
      })
      this.setData({
        videoList: res.data
      })
    })
  },
  getImageList(openid) {
    getmedialist({
      openid,
      centent: '党建留念'
    }).then(res => {
      res.data.map(item => {
        item.week = item.uploadtime.split('+')[0]
        item.date = item.uploadtime.split('+')[1]
      })
      this.setData({
        imageList: res.data
      })
    })
  },
  videoPlay(e) {
    wx.navigateTo({
      url: `/pages/video/video?url=${e.currentTarget.dataset.url}`
    })
  },
  goToImage(e) {
    wx.navigateTo({
      url: `/pages/image/image?url=${e.currentTarget.dataset.url}`
    })
  }
})