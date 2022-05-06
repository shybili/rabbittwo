<template>
  <div class="order-detail-page" v-if="order">
  <!-- 操作栏 -->
  <DetailAction :order="order" />
  <!-- 进度条 组件xtx-steps.vue-->
  <DetailPlan :order="order"/>
  <!-- 物流栏 -->
  <DetailLogistic v-if="[3,4,5].includes(order.orderState)" :order="order"/>
  <!-- 订单商品信息 -->
  <DetailInfo :order="order"/>
</div>
</template>

<script>
import DetailAction from './components/detail-action.vue'
import DetailPlan from './components/detail-plan.vue'
import DetailLogistic from './components/detail-logistic.vue'
import DetailInfo from './components/detail-info.vue'
import {findOrderList} from '@/api/order'
import { useRoute } from 'vue-router'
import { ref } from '@vue/reactivity'
export default {
  name:'MemberOrderDetail',
  components:{DetailAction , DetailPlan,DetailLogistic ,DetailInfo},
  setup () {
    // 获取当前的订单详情数据
    const route = useRoute()
    const order = ref(null) 
    findOrderList(route.params.id).then(data => {
      order.value = data.result
    })
    // console.log(order.value);
    return {order}
  }

}
</script>

<style scoped lang="less">
.order-detail-page {
  background: #fff;
  height: 100%;
}
</style>