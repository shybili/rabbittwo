import { createRouter, createWebHashHistory } from 'vue-router'
const HeadTail = () => import('@/views/headtail')
const Home = () => import('@/views/home/index')
const TopCategory = () => import('@/views/category/index')
const SubCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods/index')
const Cart = () => import('@/views/cart/index')


const Login = () => import('@/views/login/index')
const LoginCallBack = () => import('@/views/login/callback')

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
      {path:'/cart' , component:Cart},
    ] 
  },
  // 登录模块，一级路由
  {path:'/login' ,component:Login},
  // qq回调页面
  {path:'/login/callback' ,component:LoginCallBack}

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
