<template>
  <div class='sub-category'>
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 品牌展示项目 -->
      <SubFilter/>
      <!-- 商品展示和(排序和列表） -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort />
        <!-- 列表 -->
        <ul>
          <li v-for="i in 20" :key="i" >
            <GoodsItem :goods="{}" />
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <XtxInfiniteLoading/>
      </div>
    </div>
  </div>
</template>

<script>
import SubBread from './components/sub-bread'
import SubFilter from './components/sub-filter'
import SubSort from './components/sub-sort'
import GoodsItem from './components/Goods-item'
export default {
  name: 'SubCategory',
  components: { SubBread,SubFilter,SubSort,GoodsItem,}
}
</script>

<style scoped lang='less'>
.goods-list {
 background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
 }
</style>
