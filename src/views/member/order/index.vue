<template>
 <div class="member-order-page">
   <!-- tab组件 -->
    <XtxTabs v-model="activeName" @tabClick="tabChange">
      <XtxTabsPanel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
        >
        </XtxTabsPanel>
    </XtxTabs>
    <!-- 列表组件 -->
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem 
      @cancel="cancelCom"
      @delete="deleteOrderList"
      @confirm="confirmOrderList"
      @logistic="logisticOrderList"
      v-for="item in orderList"
        :key="item.id" 
        :order="item"/>
    </div>
    <!-- 分页组件 -->
    <XtxPagination 
    v-if="total>0"
    :currentPage="reqParams.page"
    :pageSize="reqParams.pageSize"
    :total="5"
    />
    <!-- 取消订单的对话框 -->
    <OrderCancel ref="target"/>
    <!-- 查看物流的对话框组件 -->
    <OrderLogistic ref="openLogistic"/>
  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { orderStatus } from '@/api/contants'
import { findOrderInfo ,delteOrder ,confirmOrder } from '@/api/order'
import OrderItem from './components/order-item.vue'
import OrderCancel from './components/order-cancel.vue'
import OrderLogistic from './components/order-logistic.vue'
import XtxPagination from '../../../components/library/Xtx-pagination.vue'
import { watch } from '@vue/runtime-core'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/message'
export default {
  name:'MemberOrder',
  components:{ OrderItem, XtxPagination ,OrderCancel ,OrderLogistic},
  setup () {
    const activeName = ref('1')
    // const changeTab = (tab) => {
    //   console.log(tab);
    // }
    // 获取订单的数据
    const total = ref(0)
    // 加载动态效果
    const loading = ref(false)
    const reqParams = reactive({
      orderState: 0,
      page: 1,
      pageSize: 10
    })
    const orderList = ref([])

    // 请求orderList
    const getOrderList = () => {
      findOrderInfo(reqParams).then(data => {
      loading.value = true
      orderList.value = data.result.items
      total.value = data.result.counts
      loading.value = false
      })
    }

    // 监听reqParams 的改变，默认请求一次数据
    watch(reqParams,() => {
      getOrderList()
    
    },{immediate:true})
    
    // 点击的时候，tab切换详情显示
    const tabChange = ({index}) => {
      reqParams.page = index,
      reqParams.orderState = index
    }

   
    // 删除订单
    const deleteOrderList = (order) => {
      Confirm({text:'亲，确定删除订单吗？'}).then(() => {
         delteOrder(order.id).then(() => {
           getOrderList()
           Message({type:'success' , text:'删除订单成功'})
       })
      }).catch(() => {})
    }
    return { 
    activeName,
     orderStatus,
     orderList ,
     tabChange ,
     reqParams ,
     total ,
     loading ,
     getOrderList , 
    deleteOrderList,
    ...useDelete(),
    ...useConfirm(),
    ...useLogistic()
    }
  } 
}

// 封装删除订单的逻辑
const useDelete = () => {
   // 取消订单
    const target = ref(null)
    const cancelCom = (order) => {
      target.value.open(order)
    }
    return {target, cancelCom}
}

// 封装确认收货的逻辑，到时候订单详情需要复用
const useConfirm = () => {
  // 确认收货
  const confirmOrderList = (order) => {
    Confirm({text:'亲，收获之后将无法退款？'}).then(() => {
         confirmOrder(order.id).then(() => { 
           Message({type:'success' , text:'收获订单成功'})
           order.orderState = 4
       })
      }).catch(() => {})
  }
  return { confirmOrderList}
}

// 封装查看物流信息逻辑
const useLogistic = () => {
  // 标记物流组件。然后打开
  const openLogistic = ref(null)
  const logisticOrderList = (order) => { 
    openLogistic.value.open(order)
  }
  return {logisticOrderList ,openLogistic}
}

</script>

<style scoped lang="less">
.order-list {
  padding: 20px;
  position: relative;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255,255,255,.9) url(../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>