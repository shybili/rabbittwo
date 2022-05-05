<template>
  <!-- 装载是内容 -->
  <div class="xtx-tabs-panel" v-show="active===name" >
    <slot />
  </div>
</template>
<script>
import { inject } from '@vue/runtime-core'
export default {
  name:'XtxTabsPanel',
  props:{
    label:{
      type:String,
      default:''
    },
    name:{
      type: [String,Number],
      default:''
    }
  },
  setup () {
    const active = inject('activeName')
    return {active}
  }

}
</script>

<style>

</style>