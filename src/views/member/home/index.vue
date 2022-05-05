<template>
  <div class="member-home">
      <!-- 面板组件 -->
      <HomeTab/>
      <!-- 我的收藏 -->
      <HomePanel title="我的收藏">
        <GoodsItem v-for="item in goodsList" :key="item.id" :goods="item"/>
      </HomePanel>
      <!--  我的足迹-->
      <HomePanel title="我的足迹" v-if="goodHistory">
        <GoodsItem v-for="item in goodHistory" :key="item.id" :goods="item.spu"/>
      </HomePanel>
      <!-- 猜你喜欢 -->
      <GoodsRelevant/>
  </div>
</template>
<script>
import HomeTab from './components/home-tab.vue'
import HomePanel from './components/home-panel.vue'
import GoodsRelevant from '@/views/goods/components/goods-relevant'
import GoodsItem from '@/views/category/components/Goods-item'
import { findCollect ,findCollectHistory} from '@/api/member'
import { ref } from '@vue/reactivity'
export default {
  name: 'MemberHome',
  components:{ HomeTab, HomePanel ,GoodsRelevant ,GoodsItem},
  setup () {
    // 模拟接口数据
    const goodsList = ref([])
    findCollect({
      page:1,
      pageSize: 4
    }).then(data => {
      goodsList.value = data.result.item
    })

    // 获取足迹的数据
    const goodHistory = ref([])
    findCollectHistory({page:1,pageSize:4}).then(data => {
      goodHistory.value = data.result.items
    })
    // console.log(goodHistory.value);
    return { goodsList ,goodHistory }
  }

}
</script>
<style scoped lang="less">
:deep(.xtx-carousel) .carousel-btn.prev {
  left: 0;
}
:deep(.xtx-carousel) .carousel-btn.next {
  right: 0;
}
</style>