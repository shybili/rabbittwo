<template>
  <div class="goods-comment" v-if="commentData">
    <!-- 评价信息头 -->
    <div class="head">
      <div class="data">
        <p><span>{{commentData.salesCount}}</span><span>人购买</span></p>
        <p><span>{{commentData.praisePercent}}</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a @click="changI(i)" href="javascript:;" v-for="(item,i) in commentData.tags" :key="item.title" :class="{active:num === i}">{{item.title}}（{{item.tagCount}}）</a>
        </div>
      </div> 
    </div>
    <div class="sort">
      <span>排序：</span>
      <a @click="changeSort(null) " href="javascript:;" :class="{active:reqParams.sortField === null}">默认</a>
      <a @click="changeSort('praiseCount')" href="javascript:;" :class="{active:reqParams.sortField === 'praiseCount'}">最新</a>
      <a @click="changeSort('createTime')" href="javascript:;" :class="{active:reqParams.sortField === 'createTime'}">最热</a>
    </div>
    <!-- 评价列表 -->
    <div class="list" v-if="CommentList">
      <div class="item" v-for="item in CommentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{forMatName(item.member.nickname)}}</span>
        </div>
        <div class="body">
          <div class="score">
            <i v-for="i in item.score" :key="i" class="iconfont icon-wjx01"></i>
            <i v-for="j in 5-item.score" :key="j" class="iconfont icon-wjx02"></i>
            <span class="attr">{{changeForMat(item.orderInfo.specs)}}</span>
          </div>
          <div class="text">{{item.content}}</div>
          <!-- 图片放大预览 -->
          <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pistures"/>
          <div class="time">
            <span>{{item.createTime}}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{item.praiseCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页表 -->
    <XtxPagination v-if="total" @current-change="changePagerFn" :total="total" :pageSize="reqParams.pageSize" :currentPage="reqParams.page"  />
  </div>
</template>
<script>
import { ref ,reactive  } from '@vue/reactivity'
import { findGoodsComment ,findGoodsCommentList } from '@/api/product.js'
import { useRoute } from 'vue-router'
import { watch } from '@vue/runtime-core'
import GoodsCommentImage from './goods-comment-img.vue'
export default {
  name: 'GoodsComment',
  components:{GoodsCommentImage},
  setup () {
    //1 获取数据信息
    const commentData = ref(null)
    const route = useRoute()
    findGoodsComment(route.params.id).then(data => {
      // 添加tag
      data.result.tags.unshift({title:'有图',
      tagCount:data.result.hasPictureCount,
      type:'img'
      })
      data.result.tags.unshift({title:'全部评价',
      tagCount:data.result.evaluateCount,
       type:'all'
      })
      commentData.value = data.result
      // console.log(data.result);
    })

    //2 更改点击的效果显示
    const num = ref(0)
    const changI = (i) => {
      num.value = i
      // 点击tag的时候修改筛选条件
      const tag = commentData.value.tags[i]
      // 情况1：全部评价
      // 情况2：有图
      // 情况3：正常tag
      if (tag.type === 'all') {
        reqParams.hasPicture = null
        reqParams.tag = null
      } else if (tag.type === 'img') {
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        reqParams.hasPicture = null
        reqParams.tag = tag.title
      }
      // 重置页码1
      reqParams.page = 1
    }

    // 更改点击事件
    const changeSort = (sortField) => {
      reqParams.sortField = sortField
      reqParams.page = 1
    }

    //3 准备筛选条件数据
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      // 排序方式：praiseCount 热度  createTime 最新
      sortField: null
    })
     
    // 4初始化需要发请求，筛选条件发生改变发请求
    const CommentList = ref([])
    const total = ref(0)
    watch(reqParams,() => {
      // console.log('发送');
    findGoodsCommentList(route.params.id,reqParams).then(data => {
      CommentList.value = data.result.items
      total.value = data.result.counts
      // console.log(data.result.items);
    })
    },{immediate:true})

    // 5定义一个过滤函数,通过空格拼接
    const changeForMat = (specs) => {
      return specs.reduce((p,c) => `${p}  ${c.name}: ${c.nameValue}`,' ').trim()
    }
    const forMatName = (nickname) => {
      return nickname.substr(0,1) + '*****' + nickname.substr(-1)
    }

    // 6 改变分页
    const changePagerFn = (val) => {
      reqParams.page = val
    }
    return {commentData ,num ,changI ,reqParams ,CommentList ,changeSort ,changeForMat , forMatName ,total ,changePagerFn}
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor,50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,&:hover {
        color: @xtxColor;
      }
    }
  }

    .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>