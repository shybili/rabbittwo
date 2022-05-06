<template>
  <div class="detail-logistics" v-if="orderList">
    <p>
      <span>{{orderList[0].text}}</span>
      <span>{{orderList[0].time}}</span>
    </p>
    <a @click="logisticInfo" href="javascript:;">查看物流</a>
  </div>
  <!-- 物流信息的对话框 -->
  <OrderLogistic ref="target"/>
</template>
<script>
import {logisticsOrder} from '@/api/order'
import OrderLogistic from './order-logistic.vue'
import { ref } from '@vue/reactivity'
export default {
  name: 'DetailLogistics',
  components:{OrderLogistic},
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    const orderList = ref(null)
    logisticsOrder(props.order.id).then(data => {
      orderList.value = data.result.list
    })
    // console.log(orderList);

    // 打开物流信息的对话框
    const target = ref(null)
    const logisticInfo = () => {
      target.value.open(props.order)
    }
    return {orderList ,logisticInfo ,target}
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
