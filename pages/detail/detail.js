// pages/detail.js
let datas = require('../../datas/list-data');

//获取全局小程序的实例
let appData = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datailObj:{},
    index:0,
    isCollected: false,  //标识当前页面的文章是否被收藏
    isMusicPlay: false  //标识音乐是否播放
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    //获取跳转过来的哪一个板块
    let {index} = options;
    let detailObj = datas.list_data[index];
    console.log(detailObj)
    
    //更新data中的数据
    this.setData({
      detailObj,index
    });

    //获取存储的数据
    let obj = wx.getStorageSync('isCollected');
    if (!obj) {// 用户没有点击过
      // 初始化空的对象缓存到本地-----> 点击收藏的时候
      let obj = {};
      // 缓存本地
      wx.setStorage({
        key: 'isCollected',
        data: obj
      })

    } else {// 用户点击过
      // 判断用户是否收藏当前页面
      let isCollected = obj[index];
      // if(!isCollected){ // 应该显示的状态是没有收藏过
      //   isCollected = false;
      // }else {// 应该显示的状态是收藏过
      //   isCollected = true;
      // }
      isCollected = isCollected ? true : false;
      // 修改data中isCollected的状态值
      this.setData({ isCollected });
    };

    // 判断当前页面的音乐是否在播放
    let { isPlay, pageIndex } = appData.data;
    if (isPlay && pageIndex === index) {
      this.setData({ isMusicPlay: true })
    }

    // 监听音乐的播放和暂停
    wx.onBackgroundAudioPlay(() => {
      console.log('音乐播放');
      // 修改data中isMusicPlay是否播放的标识
      this.setData({ isMusicPlay: true });

      // 修改全局data音乐是否播放的标识
      appData.data.isPlay = true;
      appData.data.pageIndex = index;
    });
    wx.onBackgroundAudioPause(() => {
      console.log('音乐暂停');
      this.setData({ isMusicPlay: false });
      appData.data.isPlay = false;
    });
  },

  //音乐是否播放

  musicControl(){
    let isMusicPlay = !this.data.isMusicPlay;

    // 动态修改data中isMusicPlay的状态值
    this.setData({ isMusicPlay });
    // 控制音乐播放
    let { dataUrl, title } = this.data.detailObj.music;
    if (isMusicPlay) { // 音乐播放
      wx.playBackgroundAudio({
        dataUrl,
        title
      })
    } else {// 音乐暂停
      wx.pauseBackgroundAudio()
    }
  },

  //是否收藏
  handleCollection(){
    let isCollected = !this.data.isCollected;
    //修改data的isCollected的状态
    this.setData({ isCollected});
    //设置toast提示框
    let title = isCollected?'收藏成功':'取消收藏';
    wx.showToast({
      title,
      icon:'success'
    })

    // 将当前页面的isCollected缓存到本地
    // 问题： 单独存储一个布尔值带来的问题是多个页面公用一个状态
    // 思考： 为每一个页面单独设置独立的标识
    /*
    * 1. 如何判断是那个页面： index
    * 2. 存储的数据类型：{0：true, 1: false, 2:false}
    *
    * */
    // 获取页面标识
    let { index } = this.data;
    // 问题根源：obj = {0： true}
    // let obj = {}; 会覆盖原来页面的存储状态
    let obj = wx.getStorageSync('isCollected');
    // console.log(obj, typeof obj);

    obj[index] = isCollected;
    wx.setStorage({
      key: 'isCollected',
      data: obj
    })
  },

  //点击分享按钮
  handleShare() {
    wx.showActionSheet({
      itemList: ['分享到朋友圈', '分享到qq空间', '分享到微信好友'],
      itemColor: '#666'
    })
  },
})