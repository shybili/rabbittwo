<template>
  <div class="xtx-checkbox" @click="changeCheck" >
    <i v-if="check" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <!-- 接收复选框的名字 -->
    <span v-if="!$store.default"><slot /></span>
  </div>
</template>

<script>
import { useVModel } from '@vueuse/core'
// v-model  ====>  :modelValue  +   @update:modelValue
export default {
  name:'XtxCheckbox',
  props:{
    modelValue:{
      type: Boolean,
      default: false
    }
  },
  setup (props , {emit}) {
    // 使用useVModel实现双向数据绑定v-model指令
    // 1. 使用props接收modelValue
    // 2. 使用useVModel来包装props中的modelValue属性数据
    // 3. 在使用checked.value就是使用父组件数据
    // 4. 在使用checked.value = '数据' 赋值，触发emit('update:modelvalue', '数据')
    const check = useVModel(props , 'modelValue', emit)
    const changeCheck = () => {
      const newVal = !check.value
      // 通知父组件
      check.value = newVal
      // 让组件支持change事件,把改变的值传给父组件
      emit('change', newVal)
    }
    return {check,changeCheck}
  }
}
</script>

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>