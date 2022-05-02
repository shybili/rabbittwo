<template>
<!-- 一级路由 -->
  <!-- 顶部通栏 -->
  <appNavbar></appNavbar>
  <!-- 头部通栏 -->
  <appHeader></appHeader>
  <!-- 吸顶头部 -->
  <appHeaderSticky></appHeaderSticky>
   <!-- 二级路由 -->
  <div class="appBody">
    <router-view></router-view>
  </div>
  <!-- 底部通栏 -->
  <appFooter></appFooter> 
</template>

<script>
import appNavbar from '../components/appNavbar.vue'
import appHeader from '../components/appHeader.vue'
import appFooter from '../components/appFooter.vue'
import appHeaderSticky from '../components/appHeaderSticky.vue'
import { useStore} from 'vuex'
export default {
  name:"HeadTail",
  components:{
    appNavbar,
    appHeader,
    appFooter,
    appHeaderSticky,
  },
  setup(){
    const store = useStore()
    //调用方法
    store.dispatch('category/getList')
  }
}
</script>

<style>
 .appBody{
   min-height: 600px;
 }
</style>