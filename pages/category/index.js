import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList:[],
    //右侧的菜单数据
    rightContent:[],
    //被点击的左侧菜单
    currentIndex:0,
    //右侧内容的滚动条距离顶部距离
    scrollTop:0
  },
  // 接口的返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1获取本地存储数据
    const Cates = wx.getStorageSync("cates");
    if(!Cates){
      console.log("没有使用缓存");
      this.getCates();
    }else{
      if(Date.now()-Cates.time>1000*100){
        this.getCates();
      }else{
        console.log("使用缓存");
        this.Cates=Cates.data;
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        let rightContent=this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  async getCates(){
    const res=await request({url:"/categories"}); 
    this.Cates=res;
    //缓存
    wx.setStorageSync("cates", {time:Date.now(),data:this.Cates})
    //构造左侧的菜单
    let leftMenuList=this.Cates.map(v=>v.cat_name);
    //构造右侧的商品数据
    let rightContent=this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  //左侧菜单的点击事件
  handleItemTap(e){
    const {index}=e.currentTarget.dataset;
    let rightContent=this.Cates[index].children
    this.setData({
      currentIndex:index,
      rightContent,
      //重新设置右侧内容距离
      scrollTop:0
    })
  }


})