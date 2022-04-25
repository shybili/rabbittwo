<template>
  <div class='xtx-goods-page' v-if="goods" >
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem >{{goods.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures"/>
          <GoodsSale/>
        </div>
        <div class="spec">
          <GoodsName :goods="goods"/>
          <!-- sku组件 skuId='300243239' -->
          <GoodsSku :goods="goods"  @change="changeSku"/>
          <!-- 点击的数量 -->
          <XtxNumbox label="数量" v-model="num" :max="goods.inventory"/>
          <!-- 按钮 -->
          <XtxButton @click="inserctCart()" type="plain" size="middle" style="margin:20px 0 0 20px">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐/猜你喜欢 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTab/>
          <!-- 注意事项 -->
          <GoodsWarm/>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot/>
          <GoodsHot :type=2 />
          <GoodsHot :type=3 />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, provide, ref, watch } from 'vue'
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image'
import GoodsName from './components/goods-name'
import GoodsSale from './components/goods-sale'
import GoodsSku from './components/goods-sku'
import GoodsTab from './components/goods-tab'
import GoodsHot from './components/goods-hot'
import GoodsWarm from './components/goods-warm'
import { useRoute } from 'vue-router'
import { findGoods } from '@/api/product'
import { useStore } from 'vuex'
import Message from '@/components/library/message'

export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant ,GoodsImage ,GoodsName ,GoodsSale ,GoodsSku ,GoodsTab,GoodsHot,GoodsWarm},
  setup () {
    // 默认库存数量是1
    const num = ref(1)
     const goods = useGoods() 

    // 把数据提供给子组件使用，即爷传孙 （"键名"，键值）
     provide('goods' , goods)

     const changeSku = (sku) => {
      //  修改现在商品的信息
      if(sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      //  console.log(sku); 
      // 获取当前选中的规格
      currSku.value = sku
     }
    // console.log(goods); 

    //---------------- 加入购物车-------------------------
    const store = useStore()
    const currSku = ref(null)
    const inserctCart = () => {
      // 在这里改变vueX里面cart的数据
      if(currSku.value && currSku.value.skuId) {
        // id skuId name attrsText picture price nowPrice selected stock count isEffective
        const { skuId, specsText: attrsText, inventory: stock } = currSku.value
        const { id, name, price, mainPictures } = goods.value
        store.dispatch('cart/insertCart',{
          skuId,
          attrsText,
          stock,
          id,
          name,
          price,
          nowPrice: price,
          picture: mainPictures[0],
          selected: true,
          isEffective: true,
          count: num.value
        }).then(() => {
          Message({type:'success', text:'加入购物车成功'})
        })
        
      }else {
        Message({text:'请选择商品的规格'})
      }
    }
     return {goods ,changeSku ,num ,inserctCart}
   }
} 
// 获取商品详情，拿到外面是为了减少setup里面的代码量
const useGoods = () => {
     const goods = ref(null)
     const route = useRoute()
    //  防止路由地址发生变化的时候组件不会初始化
     watch(() => route.params.id,(newVal) => {
      //  只有在商品详情页面的时候才去发请求 ，防止服务器报错
      // nextTick()方法是为了使组件可以在没有数据的时候销毁，改变goods里面的赋值，进行页面的重新渲染
      if (newVal && `/product/${newVal}` === route.path)
      {
        findGoods(route.params.id).then(data => {
        goods.value = null
        nextTick(() => {
          goods.value = data.result
        })
        
      })
      } 
      
     },{immediate:true})
     return goods
   }
  
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
// .goods-tabs {
//   min-height: 600px;
//   background: #fff;
// }
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>