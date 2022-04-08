<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem v-if="category.top" :to="`/category/${category.top.id}`">{{category.top.name}}</XtxBreadItem>
    <Transition name="fade-right" mode="out-in">
      <XtxBreadItem v-if="category.sub" :key="category.sub.id">{{category.sub.name}}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name:'SubBread',
  // setup () { 
  //   const route = useRoute()
  //   const store = useStore()
  //   const category = computed( () => {
  //     const cate = {top:{},sub:{}}
  //     // top是顶部的数据，所以要遍历获取二级数据
  //     store.state.category.list.forEach(top => {
  //       if(top.children)
  //       {
  //         const sub = top.children.find(sub => sub.id === route.params.id)
  //         if(sub)
  //         {
  //           cate.top = {id : top.id , name : top.name}
  //           cate.sub = {id : sub.id , name : sub.name}
  //         }
  //       }
        
  //     })
  //     return {cate}
  //   })

  //   return {category}
  // }
   setup () {
    // 通过计算属性从vuex获取顶级和二级类目信息
    // 数据对象：{top:{id,name},sub:{id:name}}
    const route = useRoute()
    const store = useStore()
    const category = computed(() => {
      const cate = {}
      // 完成获取数据逻辑
      store.state.category.list.forEach(top => {
        if (top.children) {
          const sub = top.children.find(sub => sub.id === route.params.id)
          if (sub) {
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      return cate
    })

    return { category }
  }
}
</script>

<style>

</style>