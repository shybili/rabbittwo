// 封装成vue实例函数式调用 封装的是xtx-message组件函数式调用
// vue3.0使用app.config.globalProperties挂载原型方法
// 也支持直接导入函数使用

// 实现：根据xtx-message.vue渲染消息提示
// 1. 导入组件
// 2. 根据组件创建虚拟节点
// 3. 准备一个DOM容器
// 4. 把虚拟节点渲染DOM容器中
// 5. 开启定时，移出DOM容器内容

// 实现使用函数调用xtx-message组件的逻辑 // 1. 导入组件
import { createVNode ,render } from 'vue'
import XtxMessage from './Xtx-message.vue' 

// 3. 准备一个DOM容器
const div = document.createElement('div')
// [可选的class] 加上是为了可以显示查找
div.setAttribute('class','Xtx-message') 
document.body.appendChild(div)

// 定时器标识
let timer = null

// 导出的是一个函数
export default ({type,text}) => {
  // 2. 根据组件创建虚拟节点（组件，组件里面的props）
 const vsnode = createVNode(XtxMessage , {type,text})
 // 4. 把虚拟节点渲染DOM容器中
 render(vsnode,div)

 // 5. 开启定时，移出DOM容器内容
 clearTimeout(timer)
 timer = setTimeout(() => {
  render(null, div)
 }, 3000)
}