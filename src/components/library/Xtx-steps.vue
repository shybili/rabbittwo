<script>
export default {
  name: 'XtxSteps',
  props:{
    active:{
      type: Number,
      default:1
    }
  },
  render () {
    // active是定义显示hover效果的有几个
    // 获取插槽里面的所有内容
    const items = this.$slots.default()
    // 动态的获取插槽里面的内容，把每一个xtx-step-item插入到数组中
    const daymaic = []
    items.forEach(item => {
      if(item.type.name === 'XtxStepsItem') {
        daymaic.push(item)
      }else {
        item.children.forEach(com => {
          daymaic.push(com)
        })
      }
    })
    // 根据daymaic,创建jsx 节点
    const jsxItems = daymaic.map((item,i) => {
      return <div class="xtx-steps-item" class={{active: i < this.active}}>
        <div class="step"><span>{i + 1}</span></div>
        <div class="title">{item.props.title}</div>
        <div class="desc">{item.props.desc}</div>
      </div>
    })
    return <div class="xtx-steps">{jsxItems}</div>
  }
}
</script>
<style lang="less">
.xtx-steps {
  display: flex;
  text-align: center;
  &-item {
    flex: 1;
    &:first-child {
      .step {
        &::before {
          display: none;
        }
      }
    }
    &:last-child {
      .step {
        &::after {
          display: none;
        }
      }
    }
    &.active {
      .step {
        > span {
          border-color: @xtxColor;
          background: @xtxColor;
          color: #fff
        }
        &::before,&::after {
          background: @xtxColor;
        }
      }
      .title {
        color: @xtxColor;
      }
    }
    .step {
      position: relative;
      > span {
        width: 48px;
        height: 48px;
        font-size: 28px;
        border: 2px solid #e4e4e4;
        background: #fff;
        border-radius: 50%;
        line-height: 44px;
        color: #ccc;
        display: inline-block;
        position: relative;
        z-index: 1;
      }
      &::after,&::before{
        content: "";
        position: absolute;
        top: 23px;
        width: 50%;
        height: 2px;
        background: #e4e4e4;
      }
      &::before {
         left: 0;
      }
      &::after {
         right: 0;
       }
    }
    .title {
      color: #999;
      padding-top: 12px;
    }
    .desc {
      font-size: 12px;
      color: #999;
      padding-top: 6px;
    }
  }
}
</style>