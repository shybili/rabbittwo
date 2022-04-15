<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <!-- 动画效果只有在节点改变的时候才会生效 ,mode指定动画的效果模式-->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <Transition name="fade-right" mode="out-in">
        <XtxBreadItem :key="topCategory.id">{{topCategory.name}}</XtxBreadItem>
        </Transition>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxLunbo :slider="sliders" style="height:500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in topCategory.children" :key="item.id">
            <a href="javascript::">
              <img :src="item.picture" >
              <p>{{item.name}}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品 -->
      <div class="ref-goods" v-for="sub in subList" :key="sub.id" >
        <div class="head">
          <h3 >- {{sub.name}} -</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <XtxMore :path="`/category/sub/${sub.id}`"/>
        </div>
        <div class="body">
          <GoodsItem v-for="good in sub.goods" :key="good.id"  :goods="good"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref ,computed ,watch} from 'vue'
import {findBanner} from '@/api/home'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import GoodsItem from './components/Goods-item.vue'
import {findTopcategory} from '@/api/categorys'

export default {
  name:'TopCategory',
  components:{GoodsItem},
  setup () {
    // 获取轮播图数据
    const sliders = ref([])
    findBanner().then(data => {
      sliders.value = data.result
    })

    // 获取面包屑和所有分类数据数据
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      let cate = {}
      const item = store.state.category.list.find(item => {
        return item.id === route.params.id
      })
      if (item) cate = item
      return cate
    })
    // 获取各个子类目的推荐商品
    const subList = ref([])
    //把获取子类商品的数据封装成一个方法，在加一个watch监听事件，即在访问数据的时候不用在加载组件的内容，减少数据的重复加载
    const getsubList = () =>{
      findTopcategory(route.params.id).then(data => {
      subList.value = data.result.children
    })
    }
    // 获取路由数据的变化
    watch(() =>route.params.id , (newVal) => {
      if(newVal && `/category/${newVal}` === route.path)
       getsubList() 
    },{immediate:true})
    return {
      sliders,
      topCategory,
      subList,
    }
  }
}
</script>

<style scoped lang="less">


.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  // 分类商品
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>