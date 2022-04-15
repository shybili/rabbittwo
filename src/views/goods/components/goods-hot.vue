<template>
   <div class="goods-hot">
    <h3>{{title}}</h3>
    <div v-if="goodlist">
      <GoodsItem v-for="item in goodlist" :key="item.id" :goods="item" />  
    </div>  
  </div>
</template>

<script>
import GoodsItem from '@/views/category/components/Goods-item.vue'
import { computed, ref } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { findGoodsHot } from '@/api/product'
export default {
  name:'GoodsHot',
  components:{GoodsItem},
  props:{
    type:{
      type: Number,
      default:1
    }
  },
  setup (props) {
    // 标题的显示
    const type = {1 : '24小时热销榜',2 : '周热销榜',3 : '总热销榜',}
    const title = computed(() => {
      return type[props.type]
    })
    // 热榜数据的获取
    const route = useRoute()
    const goodlist = ref([])
    findGoodsHot({ id:route.params.id , type: props.type}).then(data => {
      goodlist.value = data.result
    })
    // console.log(goodlist);
    return {title,goodlist}
  }
}
</script>

<style scoped lang="less">
  .goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  :deep(.goods-item){
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>