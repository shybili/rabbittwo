import { deleteCart, findCartList, getNewCartGoods ,insertCart,mergeLocalCart, selsctAllCart, updateCart } from "@/api/cart"

//购物车模块
export default{
  namespaced:true,
  state(){
    return {
      list:[]
    }
  },
  getters:{
    // 有效商品列表
    validList (state) {
      return state.list.filter(goods => goods.skuId > 0 && goods.isEffective)
    },
    // 有效商品的总件数
    validTotal (state,getters) {
      return getters.validList.reduce((p , c) => p + c.count,0)
    },
    // 有效商品的总金额
    validAmount (state,getters) {
      return getters.validList.reduce((p , c) => p + Math.round(c.count*100*c.nowPrice) ,0)/100
    },
    // 无效商品列表
    unvalidList (state) {
      return state.list.filter(goods => goods.skuId === 0 && !goods.isEffective)
    },
    // 选中商品列表
    selectList (state,getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 选中商品的总件数
    selectTotal (state,getters) {
      return getters.selectList.reduce((p , c) => p + c.count,0)
    },
    // 选中商品的总金额
    selectAmount (state,getters) {
      return getters.selectList.reduce((p , c) => p + Math.round(c.count*100*c.nowPrice) ,0)/100
    },
    // 是否全部选中
    isCheckAll (state, getters) {
      return getters.validList.length !== 0 && getters.selectList.length === getters.validList.length
    }
  },
  mutations:{
    // 删除购物车物品
    deleteCart (state , skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index , 1)
    },
    // 1 加入购物车
    insertCart (state,payload) {
      // 约定加入购物车字段必须和后端保持一致 payload对象 的字段
      // 它们是：id skuId name attrsText picture price nowPrice selected stock count isEffective
      // 插入数据规则：
      // 1. 先找下是否有相同商品
      // 2. 如果有相同的商品，查询它的数量，累加到payload上，再保存最新位置，原来商品需要删除
      // 3. 如果没有相同商品，保存在最新位置即可
      // 获取索引,没有找到的话会返回-1
      const someIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if( someIndex > -1) {
        // 找到了就要累加数量，然后删除现有的商品
        const count = state.list[someIndex].count 
        payload.count += count
        state.list.splice(someIndex,1)
      }
      // 最后都是追加新的商品
      state.list.unshift(payload)
    },

    // 2 更新商品信息，因为随着时间的推移，购物车里面的商品信息会改动
    updateCart (state , goods) {
    // goods 商品信息：nowPrice stock isEffective
    // goods 商品对象的字段不固定，对象中有哪些字段就改哪些字段，字段的值合理才改
    // goods 商品对象 必需有SKUID
     const updategood = state.list.find(item => item.skuId === goods.skuId)
    for(let key in goods) {
      if(goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
        updategood[key] = goods[key]
      }
     }
    },

    //3 合并购物车，或者说设置购物车
    setMerge (state , payload) {
      // payload 为[]即清空购物车 ，为'数组对象'时候就是设置购物车
      state.list = payload
    }
  },
  actions:{
    // 8 合并购物车,cartList为对象数组,把本地购物车的信息传给服务器
    async mergeCart (ctx) {
      const cartList = ctx.getters.validList.map(({ skuId, selected, count }) => {
        return {skuId, selected, count}
      })
      await mergeLocalCart(cartList)
      // 合并成功将本地购物车删除
      ctx.commit('setMerge',[])
    },

    //7 修改sku信息
    updateCartSku (ctx,{oldskuId , newsku}) {
      /* eslint-disable */
      return new Promise((resolve,reject) => {
        if(ctx.rootState.user.profile.token) {
        // 已登录
        // 1. 获取旧的商品信息
        // 2. 删除旧的商品
        const oldSku = ctx.state.list.find(item => item.skuId === oldskuId)
        deleteCart([oldskuId]).then(() => {
          return insertCart({skuId:newsku.skuId , count:oldSku.count})
        }).then(() => {
          return findCartList()
        }).then(data => {
          ctx.commit('setMerge' , data.result)
          resolve()
        })
      } else {
        // 未登录
        // 但你修改了sku的时候其实skuId需要更改，相当于把原来的信息移出，创建一条新的商品信息。
        // 1. 获取旧的商品信息
        const oldSku = ctx.state.list.find(item => item.skuId === oldskuId)
        // 2. 删除旧的商品
        ctx.commit('deleteCart',oldskuId)
        // 3. 合并一条新的商品信息
        const {skuId , price: nowPrice, inventory: stock , specsText: attrsText} = newsku
        const newGoods = {...oldSku,skuId, nowPrice, stock, attrsText}
        // 4. 去插入即可
        ctx.commit('insertCart',newGoods)
        // 必须要，否则无法用then获取信息
        resolve()
      }
      })
    },
    //6 批量删除列表
    batchDeleteCart (ctx,isClear) {
       /* eslint-disable */
       return new Promise((resolve,reject) => {
        if(ctx.rootState.user.profile.token) {
        // 已登录
        const ids = ctx.getters[isClear?'unvalidList':'selectList'].map(item => item.skuId)
        deleteCart(ids).then(() => {
        // 采用重新请求api接口的方式获取数据
        return findCartList()
        }).then(data => {
          ctx.commit('setMerge' , data.result)
          resolve()
        })
      } else {
        // 未登录
        ctx.getters[isClear?'unvalidList':'selectList'].forEach(item => {
          ctx.commit('deleteCart',item.skuId)
        })
        // 必须要，否则无法用then获取信息
        resolve()
      }
      })
    },
    //5 全选
    CartCheckAll (ctx,selected) {
       /* eslint-disable */
       return new Promise((resolve,reject) => {
        if(ctx.rootState.user.profile.token) {
        // 已登录
        const ids = ctx.getters.validList.map(item => item.skuId)
        selsctAllCart({selected , ids}).then(() => {
          return findCartList()
        }).then(data => {
          ctx.commit('setMerge' , data.result)
          resolve()
        // ctx.getters.validList.forEach(goods => {
        //   ctx.commit('updateCart',{skuId:goods.skuId,selected})
        // })
        // // 必须要，否则无法用then获取信息
        // resolve()
        })
      } else {
        // 未登录
        ctx.getters.validList.forEach(goods => {
          ctx.commit('updateCart',{skuId:goods.skuId,selected})
        })
        // 必须要，否则无法用then获取信息
        resolve()
      }
      })
    },
    // 4更新购物车
    updateCart (ctx,payload) {
      // payload 必须穿skuid ,可能传selected 或者 count
      /* eslint-disable */
      return new Promise((resolve,reject) => {
        if(ctx.rootState.user.profile.token) {
          updateCart(payload).then(() => {
            ctx.commit('updateCart' , payload)
            // 必须要，否则无法用then获取信息
            resolve()
          })
        // 已登录
      } else {
        // 未登录
        ctx.commit('updateCart' , payload)
        // 必须要，否则无法用then获取信息
        resolve()
      }
      })
    },
    //3 删除购物车物品操作
    deleteCart (ctx , payload) {
      /* eslint-disable */
      return new Promise((resolve,reject) => {
        if(ctx.rootState.user.profile.token) {
          deleteCart([payload]).then(() => {
            // 采用重新请求api接口的方式获取数据
            return findCartList()
          }).then(data => {
            ctx.commit('setMerge' , data.result)
            resolve()
          })
        // 已登录
      } else {
        // 未登录
        // 单条删除 payload 现在就是skuId
        ctx.commit('deleteCart' , payload)
        // 必须要，否则无法用then获取信息
        resolve()
      }
      })
    },

    //2 加入购物车 ，要返回一个promise对象，判断是否登录
    insertCart(ctx , payload) {
      /* eslint-disable */
      return new Promise((resolve,reject) => {
        if(ctx.rootState.user.profile.token) {
          insertCart({skuId:payload.skuId, count : payload.count}).then(() => {
            ctx.commit('insertCart' , payload)
            // 必须要，否则无法用then获取信息
            resolve()
          })
        // 已登录
      } else {
        // 未登录
        ctx.commit('insertCart' , payload)
        // 必须要，否则无法用then获取信息
        resolve()
      }
      })
      
    },

    //1 查找改变的数据，并且改购物车数据 ， 获取商品列表
    findCart (ctx) {
      return new Promise((resolve,reject) => {
        if(ctx.rootState.user.profile.token) {
          // 已登录
          findCartList().then(data => {
            ctx.commit('setMerge' , data.result)
            resolve()
          })
        }else {
          // 未登录,处理本地数据
          // 同时发送请求（有几个商品发几个请求）等所有请求成功，一并去修改本地数据。
          // Promise.all(promise数组).then((dataList)=>{})  同时发请求，所有请求成功，得到所有成功结果
          // Promise.resolve() Promise.reject() new Promise()
          // Promise.race(promise数组).then((data)=>{}) 同时发请求，最快的请求成功，得到成功结果
          const promiseArr = ctx.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })         
          // dataList成功结果的集合，数据顺序和promiseArr顺序一致，它又是根据state.list
          Promise.all(promiseArr).then(dataList => {
            // 更新本地购物车
            dataList.forEach((data,i) => {
              ctx.commit('updateCart', {skuId:ctx.state.list[i].skuId , ...data.result})
            })
            // 调用resolve方法
            resolve()
          })
        }
      }) 
    }
  }

}