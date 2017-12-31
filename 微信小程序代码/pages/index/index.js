//index.js

var api = require('../../libs/api')



//获取应用实例

var app = getApp()

Page({

  data: {

    userInfo: {},

    citySelected: {},

    weatherData: {},

    topCity: {}

  },
  /**
   * 页面的初始数据
   */
  getDataFromOneNet: function () {
    //从oneNET请求我们的Wi-Fi气象站的数据
    const requestTask = wx.request({
      url: 'https://api.heclouds.com/devices/20429486/datapoints?datastream_id=Light,Temperature,Humidity&limit=15',
      header: {
        'content-type': 'application/json',
        'api-key': 'wIIm85oc=O2eQTXByroEN1AhNYU='
      },
      success: function (res) {
        //console.log(res.data)
        //拿到数据后保存到全局数据
        var app = getApp()
        app.globalData.temperature = res.data.data.datastreams[0]
        app.globalData.light = res.data.data.datastreams[1]
        app.globalData.humidity = res.data.data.datastreams[2]
        console.log(app.globalData.light)
        //跳转到天气页面，根据拿到的数据绘图
        wx.navigateTo({
          url: '../wifi_station/tianqi/tianqi',
        })
      },

      fail: function (res) {
        console.log("fail!!!")
      },

      complete: function (res) {
        console.log("end")
      }
    })
  },



  //事件处理函数

  showDetailPage: function (e) {

    try {

      var cityCode = e.currentTarget.dataset.city_code || '';

    } catch (e) { }



    wx.navigateTo({

      url: '../detail/detail?city_code=' + cityCode

    })

  },

  showSettingPage: function () {

    wx.navigateTo({

      url: '../setting/setting'

    })

  },

  updateTopCity: function (event) {

    var citySelected = wx.getStorageSync('citySelected');

    var weatherData = wx.getStorageSync('weatherData');

    var topCity = {

      left: "",

      center: "",

      right: "",

    };



    var current = event.detail.current;

    try { topCity.left = weatherData[citySelected[current - 1]].realtime.city_name; } catch (e) { }

    try { topCity.center = weatherData[citySelected[current]].realtime.city_name; } catch (e) { }

    try { topCity.right = weatherData[citySelected[current + 1]].realtime.city_name; } catch (e) { }



    this.setData({

      topCity: topCity,

    })

  },



  onLoad: function () {

    var defaultCityCode = "__location__";

    var citySelected = wx.getStorageSync('citySelected');

    var weatherData = wx.getStorageSync('weatherData');

    if (citySelected.length == 0 || weatherData.length == 0) {

      var that = this

      api.loadWeatherData(defaultCityCode, function (cityCode, data) {

        var weatherData = {}

        weatherData[cityCode] = data;

        that.setHomeData([cityCode], weatherData);

      });

    } else {

      this.setHomeData(citySelected, weatherData);

    }

  },



  onShow: function () {

    var citySelected = wx.getStorageSync('citySelected');

    this.setData({

      citySelected: citySelected,

    })

  },



  setHomeData: function (citySelected, weatherData) {

    var topCity = {

      left: "",

      center: "",

      right: "",

    }

    try { topCity.center = weatherData[citySelected[0]].realtime.city_name; } catch (e) { }

    try { topCity.right = weatherData[citySelected[1]].realtime.city_name; } catch (e) { }



    this.setData({

      userInfo: app.globalData.userInfo,

      weatherData: weatherData,

      topCity: topCity,

      citySelected: citySelected,

    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },



  /**

   * 用户点击右上角分享

   */

  onShareAppMessage: function () {



  }

})