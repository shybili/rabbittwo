<template>
  <div class="xtx-numbox">
    <div class="label" v-if="label">{{label}}</div>
    <div class="numbox">
      <a @click="changNumber(-1)" href="javascript:;">-</a>
      <input type="text" readonly :value="modelValue">
      <a @click="changNumber(1)" href="javascript:;">+</a>
    </div>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxNumbox',
  props:{
    label:{
      type: String,
      default:''
    },
    modelValue:{
      type: Number,
      default: 1
    },
    min:{
      type: Number,
      default: 1
    },
    max:{
      type: Number,
      default: 10
    },
    
  },
  setup (props, {emit}) {
    // useVModel来实现组件之间数据的双向绑定
    const num = useVModel(props,'modelValue',emit)
    const changNumber = (step) => {
      const newVal = num.value + step
      if(newVal < props.min || newVal > props.max) return
      // 不超出就正常赋值点击,并通知父组件
      num.value = newVal
      emit('change' ,newVal)
    }
    return {changNumber } 
  }
}
</script>
<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right:1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left:1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>