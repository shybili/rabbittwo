<template>
  <div class="home-entry">
    <!-- 首页的布置 -->
    <div class="container">
      <!-- 左侧分类 -->
    <homeCategory></homeCategory>
      <!-- 右侧轮播图 -->
    <home-lunbo></home-lunbo>
    </div>
  </div>
  <!-- 新鲜好物 -->
  <homeFresh></homeFresh>
  <!-- 人气推荐 -->
  <homeHot></homeHot>
  <!-- 品牌推荐 -->
  <HomeBrand/>
  <!-- 商品展示 -->
  <HomeProduct/>
  <!-- 最新专题 -->
  <HomeSpecial/>
</template>

<script>
import homeCategory from './components/homeCategory'
import homeLunbo from './components/homeLunbo'
import homeFresh from './components/homeFresh'
import homeHot from './components/homeHot'
import HomeBrand from './components/homeBrand'
import HomeProduct from './components/homeProduct'
import HomeSpecial from './components/homeSpecial'
export default {
  name:'homePage',
  components:{
    homeCategory,homeLunbo,homeFresh,homeHot,HomeBrand,HomeProduct,HomeSpecial
    
  }
}
</script>

<style lang="less" scoped >
 .container {
   .hoverShadow();
 }
</style>