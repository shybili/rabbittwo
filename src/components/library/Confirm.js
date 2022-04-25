// import { reject, resolve } from 'core-js/fn/promise'
import { createVNode ,render } from 'vue'
import XtxConfirm from './Xtx-confirm'

const div = document.createElement('div')
div.setAttribute('class','Xtx-confirm') 
document.body.appendChild(div)
  
// 该函数渲染XtxConfirm组件，标题和文本
// 函数的返回值是promise对象
export default ({title , text }) => {
  // 1. 渲染组件
    // 2. 点击确认按钮，触发resolve同时销毁组件
    // 销毁组件即判断是否显示
    // 3. 点击取消按钮，触发reject同时销毁组件
  return new Promise((resolve , reject) => {
    const cancelCallback = () => {
      render(null , div)
      reject(new Error('点击取消'))
    }
    const submitCallback = () => {
      render(null , div)
      resolve()
    }

    const vnNode = createVNode( XtxConfirm , {title , text , cancelCallback, submitCallback } )
    render(vnNode,div)
  })
  
}