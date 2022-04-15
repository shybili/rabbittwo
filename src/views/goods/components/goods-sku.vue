<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.name">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">  
          <img @click="changeselct(item,val)" :class="{selected:val.selected ,disabled:val.disabled}" v-if="val.picture" :src="val.picture" :title="val.name">
          <span @click="changeselct(item,val)" :class="{selected:val.selected , disabled:val.disabled}" v-else>{{val.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerset from '@/venders/power-set'
// 得到一个路径字典对象
// 存储路径字典
const pathLoalMap = {}
const spliter = "♥"
const getPathMap = (skus) => {
  // 1. 得到所有的sku集合  props.goods.skus
  // 2. 从所有的sku中筛选出有效的sku
  // 3. 根据有效的sku使用power-set算法得到子集
  // 4. 根据子集往路径字典对象中存储 key-value
  skus.forEach(sku => {
    //判断是否有库存
    if(sku.inventory > 0)
    {
      // 计算当前有库存的sku的子集
      //       数组 ==》子集
      // 例如：[1,2,3] ==> [[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
      // 数组
      const valueArr = sku.specs.map(val => val.valueName)
      // 求子集
      const sonArr = powerset(valueArr)
      // 插入到对象中去
      // console.log(sonArr);
      // 遍历子集，把数据插入到pathlocalMap中
      sonArr.forEach(arr => {
        // 根据arr得到字符串的key，约定key是：['蓝色','美国'] ===> '蓝色★美国'
        const key = arr.join(spliter)
        if(pathLoalMap[key]) {
          pathLoalMap[key].push(sku.id)
        }else {
          pathLoalMap[key] = [sku.id]
        }
      })
    }
  })
  // console.log(pathLoalMap);
  return pathLoalMap
}
// 获取选中数据的数组值
const getSelectValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    // 选中按钮的对象
    const selectVal = item.values.find(val => val.selected)
    arr.push(selectVal ? selectVal.name : undefined)
  })
  return arr
}
// 更新按钮的禁用状态
const updateDisable = (specs ,pathMap) => {
  // 1. 约定每一个按钮的状态由本身的disabled数据来控制。i是索引值
  specs.forEach((item, i ) => {
    const selectedValues = getSelectValues(specs)
    item.values.forEach(val => {
      // 2. 判断当前是否选中，是选中不用判断
      if (val.selected) return
      // 3. 拿当前的值按照顺序套入选中的值数组
      selectedValues[i] = val.name
      // 4. 剔除undefined数据(values=>values是条件，判断当前里面有值，剔除underfind)，按照分隔符拼接key
      const key = selectedValues.filter(values => values).join(spliter)
      // 5. 拿着key去路径字典中查找是否有数据，有可以点击，没有就禁用（true）val.disable是一种标记
      val.disabled = !pathMap[key]
    })
  })
}

// 定义默认选中
const defaultSelected = (goods,skuId) => {
  // 找到sku的信息
  // 遍历每一个按钮，赋值
  const sku = goods.skus.find(sku => sku.id === skuId)
  goods.specs.forEach((item,i) => {
    const val = item.values.find(val => val.name === sku.specs[i].valueName )
    val.selected = true
  })
}
export default {
  name: 'GoodsSku',
  props:{
    goods:{
      type: Object,
      default: () => ({})
    },
    skuId:{
      type: String,
      default:''
    }
  }, 
  setup(props,{emit}) {
    // 得到路径字典
    const pathMap = getPathMap(props.goods.skus)
    // console.log(pathMap);
    // 根据skuid 初始化按钮点击
    if(props.skuId)
    {
      defaultSelected(props.goods,props.skuId)
    }
    
    // 调用禁用状态
    updateDisable(props.goods.specs,pathMap)
    // 定义选中信息
    const changeselct = (item,val) => {
      if(val.disable) return 
      if(val.selected) {
        val.selected = false
      } else {
        // 选着其他元素的时候，原来的选中要取消
        item.values.forEach(valitem => {
          valitem.selected = false
        })
        val.selected = true
      }
      // console.log(getSelectValues(props.goods.specs));
      // 点击时候要更新状态
      updateDisable(props.goods.specs,pathMap)
      // 把选中的信息传给父组件，要完整的sku信息才传信息,filter过滤掉无效的值
      // 没有选中完整也要穿给父组件
      const valSelected = getSelectValues(props.goods.specs).filter(v => v)
      if(valSelected.length === props.goods.specs.length) {
        const skuids = pathMap[valSelected.join(spliter)]
        const sku = props.goods.skus.find(s => s.id === skuids[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 属性名：属性值 属性名1：属性值1 ... 这样的字符串,通过reduce累加链接。trim()去除头部的空字符串
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}：${c.valueName}`, '').trim()
        })
      }else {
        //null的话 方便是否加入购物车
        emit('change',{})
      }

    }
    return {changeselct ,pathMap} 
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.5;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>