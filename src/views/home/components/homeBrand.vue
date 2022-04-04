<template>
  <HomeModel title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <a @click="targget(-1)" :class="{disabled:index === 0}" href="javascript:;" class="iconfont icon-angle-left prev"></a>
      <a @click="targget(1)" :class="{disabled:index === 1}" href="javascript:;" class="iconfont icon-angle-right next"></a>
    </template>
    <div class="box" ref="target">
      <Transition name="fade">
      <ul class="list" :style="{transform:`translateX(${-index*1240}px)`}" v-if="brands.length">
        <li v-for="item in brands" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="">
          </RouterLink>
        </li>
      </ul>
        <div v-else class="skeleton">
              <XtxSkeleton class="item" v-for="i in 5" :key="i" animated bg="#e4e4e4" width="240px" height="305px"/>
        </div>
      </Transition>
    </div>
  </HomeModel>
</template>

<script>
import { ref } from 'vue'
import HomeModel from './homeModel'
import {findBrand} from '@/api/home.js'
import { useLazyData } from '@/hooks/index.js'
export default {
  name: 'HomeBrand',
  components: { HomeModel },
  setup () {
    //数据懒加载
    const {target,result} = useLazyData(() =>findBrand(10))
    //页面的跳转
    const index = ref(0)
    const targget = (step) => {
      let newIndex = index.value + step
      if(newIndex <0 || newIndex > 1) return
      index.value = newIndex
    }
    return { brands: result ,target ,targget,index}
  }
  
}
</script>

<style scoped lang='less'>
.skeleton {
  width: 100%;
  display: flex;
  .item {
    margin-right: 10px;
    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}

.home-panel {
  background:#f5f5f5
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
</style>