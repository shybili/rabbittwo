<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="tochange()" :class="{active:vewable}">
      <span v-if="!fullLocation" class="placeholder" >请选择配送地址</span>
      <span v-else class="value">{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="vewable">
      <!-- 数据没有加载到的时候显示的样式 -->
      <div class="loading" v-if="loading"></div>
      <!-- 加template是因为v-else和v-for不可以同时在一个标签里面 -->
      <template v-else>
        <span class="ellipsis" @click="changeCity(item)" v-for="item in currList" :key="item.code">{{item.name}}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
import { computed } from '@vue/runtime-core'
export default {
  name:'XtxCity',
  props:{
    fullLocation:{
      type:String,
      default:''
    }
  },
  setup (props,{emit}) {
    //存储获取到的数据
    const allCity = ref([])
    // 定义一个数据未获取之前的加载动画
    const loading = ref(false)
    // 定义显示和隐藏地址栏
   const vewable =  ref(false)
   const open = () => {
     vewable.value = true
     loading.value = true
    //  在这里调用数据
    getCityData().then(data => {
      allCity.value = data
      loading.value = false
    })
    // 每次打开的时候清空地址数据
    for(let i in city)
    {
      city[i] = ''
    }
   }

   const close = () => {
     vewable.value = false
   }

   const tochange = () => {
     vewable.value ? close() : open()
   }
  // 当鼠标点击在外面的时候收起地址栏
  // 先绑定元素
  const target = ref(null)
  onClickOutside(target , () => {
    close()
  })

// 计算属性显示相应的地址信息
const currList = computed(() => {
  // 默认显示省一级
  let list = allCity.value
  // 可能是市一级
  if(city.provinceCode)
  {
    list = list.find(p => p.code === city.provinceCode).areaList
  }
  if(city.cityCode)
  {
    list = list.find(c => c.code === city.cityCode).areaList
  }
  // 可能是县一级
  return list
})

// 存储省市信息
  const city = reactive({
    provinceCode:'',
    provinceName:'',
    cityCode:'',
    cityName:'',
    countryCode:'',
    countryName:'',
    fullLocation:''
  })

  const changeCity = (item) => {
    // 省级
    if(item.level === 0)
    {
      city.provinceCode = item.code
      city.provinceName = item.name
    }
    // 市级
    if(item.level === 1)
    {
      city.cityCode = item.code
      city.cityName = item.name
    }
    // 县级
    if(item.level === 2)
    {
      city.countryCode = item.code
      city.countryName = item.name
      city.fullLocation = `${city.provinceName} ${city.cityName} ${city.countryName}`
      // 最后一级关闭城市选择页面
      close()
      emit('change',city)
    }
  }

   return {vewable,tochange ,target ,loading ,currList ,changeCity}
  }
}
// 获取城市数据
// 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
// 2. 何时获取？打开城市列表的时候，做个内存中缓存
// 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
  const getCityData = () => {
    // 返回的是一个promise对象
    // 判断是否是重新打开，如果不是，直接在缓存区获取数据
    /* eslint-disable */
    return new Promise((resolve , reject) => {
      // 约定数据存储在citydata数据段中
      if(window.cityData)
      {
        // 有缓存
        resolve(cityData)
      }else{
        // 没有就请求数据，用axios
        const url = "https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json"
        axios.get(url).then(res => {
          // 缓存
          window.cityData = res.data
          resolve(res.data)
        })
      }
    })
  }

</script>

<style scoped lang="less">
  .xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;  
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>