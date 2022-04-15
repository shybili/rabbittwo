<template>
  <div class="home-product" ref="target">
    <HomeModel :title="cate.name" v-for="cate in list" :key="cate.id">
      <template v-slot:right>
        <div class="sub">
          <RouterLink v-for="a in cate.children" :key="a.id" :to="`/category/sub/${a.id}`">{{a.name}}</RouterLink>
        </div>
        <XtxMore :path="`/category/${cate.id}`"/>
      </template>
      <div class="box">
        <RouterLink class="cover" to="/">
          <img v-lazy="cate.picture" alt="">
          <strong class="label">
            <span>{{cate.name}}</span>
            <span>{{cate.saleInfo}}</span>
          </strong>
        </RouterLink>
        <ul class="goods-list">
          <li v-for="item in cate.goods" :key="item.id">
            <HomeGoods :goods="item"/>
          </li>
        </ul>
      </div>
    </HomeModel>
  </div>
</template>

<script>
import HomeModel from './homeModel'
import HomeGoods from './homeGoods'
import { useLazyData } from '@/hooks/index.js' 
import { findGoods } from '@/api/home'

export default {
  name: 'HomeProduct',
  components: { HomeModel, HomeGoods },
  setup () {
  const {target , result} = useLazyData(findGoods)
  // console.log(result);
  return {list : result , target}
  }
}
</script>

<style scoped lang='less'>
.home-product {
  background: #fff;
  height: 2900px;
  .sub {
    margin-bottom: 2px;
    a {
      padding: 2px 12px;
      font-size: 16px;
      border-radius: 4px;
      &:hover {
        background: @xtxColor;
        color: #fff;
      }
      &:last-child {
        margin-right: 80px;
      }
    }
  }
  .box {
    display: flex;
    .cover {
      width: 240px;
      height: 610px;
      margin-right: 10px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .label {
        width: 188px;
        height: 66px;
        display: flex;
        font-size: 18px;
        color: #fff;
        line-height: 66px;
        font-weight: normal;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate3d(0,-50%,0);
        span {
          text-align: center;
          &:first-child {
            width: 76px;
            background: rgba(0,0,0,.9);
          }
          &:last-child {
            flex: 1;
            background: rgba(0,0,0,.7);
          }
        }
      }
    }
    .goods-list {
      width: 990px;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 240px;
        height: 300px;
        margin-right: 10px;
        margin-bottom: 10px;
        &:nth-last-child(-n+4) {
          margin-bottom: 0;
        }
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>