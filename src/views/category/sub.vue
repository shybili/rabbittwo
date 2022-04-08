<template>
  <div class='sub-category'>
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 品牌展示项目 -->
      <SubFilter @filter-change="filterChange"/>
      <!-- 商品展示和(排序和列表） -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort @sortChange="changeSort"/>
        <!-- 列表 -->
        <ul>
          <li v-for="goods in goodList" :key="goods.id" >
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <XtxInfiniteLoading :finished="finished" :loading="loading" @infinite="getData"/>
      </div>
    </div>
  </div>
</template>

<script>
import SubBread from './components/sub-bread'
import SubFilter from './components/sub-filter'
import SubSort from './components/sub-sort'
import GoodsItem from './components/Goods-item'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryGoods } from '@/api/categorys'
export default {
  name: 'SubCategory',
  components: { SubBread,SubFilter,SubSort,GoodsItem},
  setup () {
    const route = useRoute()
    // 加载中
    const loading = ref(false)
    // 加载完成
    const finished = ref(false)
    // 获取数据类表
    const goodList = ref([])
    // 请求参数
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    const getData = () => {
      loading.value = true
      // 设置二级分类的ID
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        // 获取数据成功
        if (result.items.length) {
          // 有数据就追加数据
          goodList.value.push(...result.items)
          // 把page改成下一页页码
          reqParams.page++
        } else {
          // 没有数据，代表加载完成
          finished.value = true
        }
        loading.value = false
      })
    }
    console.log(goodList)

  // 监听路由的改变,重置数组里面的数据
  watch(() => route.params.id,(newVal) => {
    // 判断是否更换了新页面并且新页面和当前路由一致
    if(newVal && `/category/sub/${newVal}` === route.path)
    {
      finished.value = false
      goodList.value = []
      reqParams = {
        page: 1,
        pageSize: 20
    }
    }
  })
// 更改排序组件筛选数据，重新请求
  const changeSort = (sortParams) => {
    // console.log(sortParams);
      finished.value = false
      // 合并请求参数，保留之前参数
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodList.value = []
  }
  
  
  // 2. 更改筛选组件的筛选数据，重新请求
    const filterChange = (filterParams) => {
      finished.value = false
      // 合并请求参数，保留之前参数
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodList.value = []
    }
    return { getData ,loading,finished ,goodList,changeSort,filterChange}
  }
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
