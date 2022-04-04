<template>
  <div class="home-banner">
    <!-- 把数据传给子件 -->
    <XtxLunbo :slider="slides" autoPlay />
  </div>
</template>
<script>
import {ref} from 'vue'
import {findBanner} from '@/api/home'
export default {
  name: 'homeLunbo',
  //获取轮播图数据
  setup(){
    const slides = ref([])
    findBanner().then(data => { 
      slides.value = data.result
    })
    return{slides}
  }

}
</script>
<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98
}
.xtx-carousel {
  ::v-deep .carousel-btn.prev {
    left: 270px;
  }
  ::v-deep .carousel-indicator {
    padding-left: 250px;
  }
}
</style>