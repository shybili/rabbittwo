<template>
  <!-- 顶部通栏 -->
  <appNavbar></appNavbar>
  <!-- 头部通栏 -->
  <appHeader></appHeader>
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

export default {
  name:"HeadTail",
  components:{
    appNavbar,
    appHeader,
    appFooter,
  }
}
</script>

<style>
 .appBody{
   min-height: 600px;
 }
</style>