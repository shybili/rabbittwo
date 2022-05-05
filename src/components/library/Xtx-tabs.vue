<script>
import { useVModel } from '@vueuse/core'
import { provide } from '@vue/runtime-core'
export default {
    name:'XtxTabs',
    props:{
      modelValue:{
        type:[String,Number] ,
        default:''
      }
    },
    setup (props,{emit}) {
      const activeName = useVModel(props , 'modelValue' ,emit)

       // 定义点击事件
      const tabClick = (name,index) => {
        activeName.value = name
        // 把点击的标签提交给父组件
        emit('tabClick' , {name,index})
      }
      // 把数据提供给子组件
      provide('activeName',activeName)

      return {activeName ,tabClick}
    },
    render () {
      // 获取插槽的内容
      const panels = this.$slots.default()
      // console.log(panels);

     
      // 动静态创建panels
      const dynamicPanels = []
      panels.forEach(item => {    
      if (item.type.name === 'XtxTabsPanel') {
        dynamicPanels.push(item)
      } else {
        item.children.forEach(com => {
          dynamicPanels.push(com)
        })
      }
    })
      // 动态创建nav导航
      const nav = (
      <nav> {
        dynamicPanels.map((item,i) => {
          return <a 
          onClick = {() => this.tabClick(item.props.name, i)}
          class={{active:item.props.name === this.activeName}} 
          href="javaScript:;">{item.props.label}</a>
        })
      }</nav>
      )
      return <div class="xtx-tabs">{[nav,dynamicPanels]}</div>
    }
  }
</script>

<style scoped lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    justify-content: space-around;
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>