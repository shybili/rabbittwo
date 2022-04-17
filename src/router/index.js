import { createRouter, createWebHashHistory } from 'vue-router'
const HeadTail = () => import('@/views/headtail')
const Home = () => import('@/views/home/index')
const TopCategory = () => import('@/views/category/index')
const SubCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods/index')
const Login = () => import('@/views/login/index')

const routes = [
  // 一级路由布局容器
  {path:'/' ,
    component:HeadTail,//整个页面的展示组件
    children:
    [
      {path:'/' ,component:Home},
      {path:'/category/:id' , component:TopCategory},
      {path:'/category/sub/:id' , component:SubCategory},
      {path:'/product/:id' , component:Goods},
    ] 
  },
  // 登录模块，一级路由
  {path:'/login' ,component:Login}

]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 每次切换路由的时候都是回到顶部
  scrollBehavior () {
    // 不可以用X，y
    return { left: 0, top: 0 }
  }
})

export default router
