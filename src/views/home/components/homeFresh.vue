 <template>
  <div class="home-new">
    <HomeMode title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <template #right><XtxMore path="/" /></template>
      <!-- 面板内容 -->
      <Transition name="fade">
        <ul class="goods-list" v-if="goods.length">
          <li v-for="item in goods" :key="item.id">
            <RouterLink :to="`/product/${item.id}`">
              <img :src="item.picture" alt="">
              <p class="name ellipsis">{{item.name}}</p>
              <p class="price">&yen;{{item.price}}</p>
            </RouterLink>
          </li>
        </ul>
        <HomeSkelrton v-else/>
      </Transition>
    </HomeMode>
  </div>
</template>

<script>
import { ref } from 'vue'
import HomeMode from './homeModel'
import HomeSkelrton from './homeSkelrton'
import { findNew } from '@/api/home'
export default {
  name: 'HomeNew',
  components: { HomeMode,HomeSkelrton },
  setup(){
    const goods = ref([])
    findNew().then(data => {
      return goods.value = data.result
    })
    return {goods}
  }
  

}
</script>
<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
