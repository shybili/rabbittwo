//分类
import {findAllCategory} from '@/api/categorys'
// import request from '@/utils/request'
import { topCategory } from '@/api/contants'

export default{
  namespaced:true,
  state(){
    return {
      // 如果默认是[]数组，看不见默认的9个分类，等你数据加载完毕才会看到。
      // 所以：根据常量数据来生成一个默认的顶级分类数据，不会出现空白（没数据的情况）
      list:topCategory.map(item =>({name: item}))
    }
  },
  //更改数据，payload是请求到的数据
  mutations:{
    setList(state,payload){
      state.list = payload
    }
  },
 //获取数据
  actions:{
    async getList ({ commit }){
      //获取数据
      const data = await findAllCategory()
      commit('setList' , data.result)
    }
    
  }
}