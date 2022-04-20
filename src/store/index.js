import { createStore } from 'vuex'
import createPersisteState from 'vuex-persistedstate'//创建持久化插件

import cart from './modules/cart'
import user from './modules/user'
import category from './modules/category'

export default createStore({
  state: {
  },
 
  modules: {
    cart,
    user,
    category
  },
  plugins:[
    //默认存储在localstorage
    createPersisteState({
      //本地存储名字
      key:'rabbit-shybili',
      //指定存储的路径
      paths:['user','cart']
    })
  ]
})
