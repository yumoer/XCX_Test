// pages/list/list.js
let data = require('../../datas/list-data.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //更新数据
    this.setData({
      listArr:data.list_data
    })
  },

  toDetail(event){
    console.log(event)
    //跳转页面到详情页detail
    let index = event.currentTarget.dataset.index
    wx.navigateTo({ //保留之前的页面
      url: '/pages/detail/detail?index='+index,  //动态显示，需要标识下标
    })
  },

  swiperToDetail(event){
    console.log(event)
    let index = event.target.dataset.index
    wx.navigateTo({  //保留之前的页面
      url: '/pages/detail/detail?index=' + index, //动态显示，需要标识下标
    })
  }

  
})