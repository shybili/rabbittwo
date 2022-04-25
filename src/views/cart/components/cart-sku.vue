<template>
  <div class="cart-sku" ref="target">
    <div class="attrs"  @click="tab()">
      <span class="ellipsis" >{{attrText}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="valid">
      <div class="loading" v-if="!goodsku"></div>
      <GoodSku @change="changeSku" v-else :skuId="skuId" :goods="goodsku"/>
      <XtxButton @click="submitSku" v-if="goodsku" type="primary" size="mini" style="margin-left:60px">确认</XtxButton>
    </div>
  </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import { onClickOutside } from '@vueuse/core'
import { getGoodSku } from '@/api/cart'
import GoodSku from '@/views/goods/components/goods-sku'
export default {
  name: 'CartSku',
  components:{GoodSku},
  props:{
    attrText:{
      type: String,
      default:''
    },
    skuId:{
      type: String,
      default:''
    }
  },
  setup (props , {emit}) {
    const valid = ref(false)
    const goodsku = ref(null)
    // 打开
    const open = () => {
      valid.value = true
      // 获取当前spec和sku数据
      getGoodSku(props.skuId).then(data => {
        goodsku.value = data.result
      })
    }
    // 关闭
    const close = () => {
      valid.value = false
      // goodsku.value = null
    }
    // 切换打开关闭
    const tab = () => {
       valid.value ? close() : open()
    }
    // 点击其他地方关闭
    const target = ref(null)
    onClickOutside(target,() => {
      close()
    })
    //  console.log(goodsku);


    // =======获取改变的sku信息
    const currSku = ref(null)
    const changeSku = (sku) => {
      currSku.value = sku
    }
    // console.log(currSku.value);
    // 点击确认的时候，把新的sku信息传给父组件（购物车index.vue）,然后关闭组件
    const submitSku = () => {
       if (currSku.value && currSku.value.skuId && currSku.value.skuId !== props.skuId) {
          emit('change',currSku.value)
          close()
       }
      
    }
    return {valid ,tab ,target  ,goodsku ,changeSku ,submitSku}
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display:inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor,50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(.8,1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>