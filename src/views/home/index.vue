<template>
  <div class="container">
    <!-- 首页的布置 -->
    <div class="homerntry">
      <!-- 左侧分类 -->
    <homeCategory></homeCategory>
      <!-- 右侧轮播图 -->
      
    </div>
  </div>
</template>

<script>
import homeCategory from './components/homeCategory'
export default {
  name:'homePage',
  components:{
    homeCategory,
  }
}
</script>

<style lang="less" scoped >
 .container {
   .hoverShadow();
 }
</style>