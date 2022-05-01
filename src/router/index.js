import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'

const HeadTail = () => import('@/views/headtail')
const Home = () => import('@/views/home/index')
const TopCategory = () => import('@/views/category/index')
const SubCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods/index')
const Cart = () => import('@/views/cart/index')
const Checkout = () => import('@/views/member/pay/checkout')


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
      {path:'/member/checkout' , component:Checkout},
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

// 前置导航守卫，对以'/member'开头的地址进行登录拦截判断,跳转到登录界面
// 因为是index文件，需要把store文件导入进来
router.beforeEach( (to,from,next) => {
  const {profile} = store.state.user
  if(!profile.token && to.path.startsWith('/member')) {
    // 要设置回调，防止登录之后没有跳转到结算商品页面
   return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  // 其他情况都允许通过
  next()
})
export default router
