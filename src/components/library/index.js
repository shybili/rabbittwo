//创建一个全局组件
// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展
import defaultImg from '@/assets/images/200.png'
import Message from './message'

// 导入library文件夹下的所有组件
// 批量导入需要使用一个函数 require.context(dir,deep,matching)
// 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配即文件名的后缀
const importFn = require.context('./',false,/\.vue$/)
// import XtxSkeleton from './Xtx-skeleton.vue'
// import XtxLunbo from './XtxLunbo'
// import XtxMore from './XtxMore'
// import XtxBread from './XtxBread'
// import XtxBreadItem from './Xtx-bread-item'
 

export default {
  install (app) {
    // app.component(XtxSkeleton.name,XtxSkeleton)
    // app.component(XtxLunbo.name,XtxLunbo)
    // app.component(XtxMore.name,XtxMore)
    // app.component(XtxBread.name,XtxBread)
    // app.component(XtxBreadItem.name,XtxBreadItem)
   //批量注册组件
   importFn.keys().forEach(key => {
     //导入组件,default即（export default）
     const acompoment = importFn(key).default
    // 注册组件
    app.component(acompoment.name,acompoment)
   }) 
    
    // 定义指令
    defineDirective(app)
    // defineHook(app)

    // 定义组件函数式的调用
    // 如果你想挂载全局的属性，能够通过组件实例调用的属性   即this.$message
    app.config.globalProperties.$message = Message// 原型函数
  } 
}

const defineDirective = (app) => {
  // 1. 图片懒加载指令 v-lazy
  // 原理：先存储图片地址不能在src上，当图片进入可视区，将你存储图片地址设置给图片元素即可。
  app.directive('lazy', {
    // vue2.0 监听使用指令的DOM是否创建好，钩子函数：inserted
    // vue3.0 的指令拥有的钩子函数和组件的一样，使用指令的DOM是否创建好，钩子函数：mounted
    // el是使用这个指令的元素，binding是绑定的值（对象）
    mounted (el, binding) {
      // 2. 创建一个观察对象，来观察当前使用指令的元素
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        // 一此观察就可以了
        if (isIntersecting) {
          // 停止观察
          observe.unobserve(el)
          // 3. 把指令的值设置给el的src属性 binding.value就是指令的值
          // 4. 处理图片加载失败 error 图片加载失败的事件 load 图片加载成功
          el.onerror = () => {
            // 加载失败，设置默认图
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        threshold: 0
      })
      // 开启观察
      observe.observe(el)
    }
  })
}

// const defineHook = (app) => {
//   app.directive('hook',{
//     mounted (el,binding) {
//       const observe = new IntersectionObserver(([{isIntersecting}]) => {
//         if(isIntersecting)
//         {
//           observe.unobserve(el)
//           el.onerror = () => {
//             el.src = defaultImg
//           }
//           el.src = binding.value
//         }
//       },{
//         threshold:0
//       })

//       observe.observe(el)
//     }
//   })
// } 