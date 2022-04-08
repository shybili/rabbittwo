<template>
  <ul class="app-header-nav">
    <!-- {{$store.state.category.list}} -->
    <li class="home"><RouterLink to="/">首页</RouterLink></li>
    <!-- 展示的是vuex里面的category的数据 -->
    <li v-for="item in list" :key="item.id">
      <!-- 点击的时候可以跳转到相应的页面 -->
      <RouterLink :to="`/category/${item.id}`" >{{item.name}}</RouterLink>
      <!-- 下面的是一级页面下的隐藏hover二级页面 -->
      <div class="layer">
        <ul>
          <!-- sub是二级分类里面每个小标签 -->
          <li v-for="sub in item.children" :key="sub.id">
            <RouterLink  :to="`/category/sub/${sub.id}`" >
              <img :src="sub.picture" alt="">
              <p>{{sub.name}}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import { useStore } from 'vuex'
import {computed} from 'vue'
export default {
  name: 'AppHeaderNav',
  setup(){
    
    const store = useStore()
    //拿到vuex里面的category.js里面的数据
    const list = computed(() => {
      return store.state.category.list
    })
    return {list}
  }
}
</script>

<style scoped lang='less'>
.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative; 
  z-index: 998;  
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center; 
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {  
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
      > .layer {
        height: 132px;
        opacity: 1;
      }
    }
  }
}
.layer {
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all .2s .1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>