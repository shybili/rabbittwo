//请求工具
//创建一个axios实例，具有请求拦截的功能

import axios from "axios"
import store from '@/store'
import router  from "@/router"
//方便其他组件功能使用基址
export const baseURL = 'https://apipc-xiaotuxian-front.itheima.net/'
// 账号解绑 https://apipc-xiaotuxian-front.itheima.net/login/social/unbind
// export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net//'

const instance = axios.create({
  baseURL,
  timeout:5000

})

//请求拦截器
//拦截的业务逻辑
//进行请求配置
instance.interceptors.request.use(config =>{
  //获取用户信息
  const {profile} = store.state.user
  //判断是否有token
  if(profile.token)
  {
    // 有令牌（即需要登录之后后台才会发一个令牌给你），则每次请求接口时在Header中携带
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
},err =>{
  return Promise.reject(err)
})

//响应拦截器（成功，失败）成功之后外部用.then()方法获取数据；失败401状态码就会跳转到登录界面
instance.interceptors.response.use(res =>res.data,err =>{
  //token请求失效，401状态码，进入该函数
  if(err.response && err.response.status === 401){
     // 1. 清空无效用户信息
    store.commit('user/setName',{})
    // 2. 跳转到登录页
    // 3. 跳转需要传参（当前路由地址）给登录页码
    //当前路由地址
    //encodeURIComponent转换url编码
    const fullpath = encodeURIComponent(router.currentRoute.value.fullPath)
    router.push('/login?redirectUrl=' + fullpath)
  }
  return Promise.reject(err)
})

//请求工具函数
// 负责发请求：请求地址，请求方式，提交的数据
export default (url,method,submitData) => {
  return instance({
    url,
    method,
    // 1. 如果是get请求  需要使用params来传递submitData   ?a=10&c=10
    // 2. 如果不是get请求  需要使用data来传递submitData   请求体传参
    // [] 设置一个动态的key, 写js表达式，js表达式的执行结果当作KEY
    // method参数：get,Get,GET  转换成小写再来判断
    // 在对象，['params']:submitData ===== params:submitData 这样理解
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
  
