//模拟接口，使得以后有数据的时候可以减少改动
// 在后端没有数据的时候可以继续完成前端的任务
// mockjs可以模拟可更快的得到较为真实的数据，且可以拦截axios的接口调用，
// 让我们的代码实现了调用接口的逻辑且得到模拟的数据，保存业务完整度。当然模拟数据有一定的规则请参考： http://mockjs.com/
// 目标：模拟 /my/test 接口，随机返回点数据。
// qs 是node.js 自带的函数库 ， 里面可以解析前端传过来的参数，方便数据的使用
import Mock from 'mockjs'
import qs from 'qs'


// 接口配置
Mock.setup({
  // 随机延时500-1000毫秒,不设置的话请求只需要2到3mm ，太快了
  timeout:'500-1000'
})

// 拦截请求，
// 第一个参数：url，使用正则去匹配
// 第二个参数：请求方式
// 第三个参数： 生成数据的函数
Mock.mock(/\/my\/text/, 'get', () => {
  return { msg: '请求测试接口成功', result: [] }
})

// 拦截一个新的接口:我的收藏拦截接口
Mock.mock(/\/member\/collect/ , 'get' , config => {

  const querystr = config.url.split('?')[1]
  const queryobject = qs.parse(querystr)
  const item = []
  for(let i = 0 ; i <queryobject.pageSize ; i++) {
    item.push(Mock.mock({
      id:'@id',
      name:'@ctitle(4,8)',
      desc:'@ctitle(10,12)',
      price: '@float(100,500,2,2)',
      // http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_7.jpg
      // https://yanxuan-item.nosdn.127.net/4a9f4a6deefc5f3ea9f0456fe197a4d4.jpg
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
    }))
  }

  return { 
  msg: '请求收藏商品成功',
  result: {
    counts: 35,
    pageSize: +queryobject.pageSize,
    page: +queryobject.page,
    item } 
  }
})