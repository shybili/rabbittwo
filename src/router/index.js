import { createRouter, createWebHashHistory } from 'vue-router'
const HeadTail = () => import('@/views/headtail')
const Home = () => import('@/views/home/index')

const routes = [
  // 一级路由布局容器
  {path:'/' ,
  component:HeadTail,
  children:[
    {path:'/' ,component:Home}
  ]
    
  
}

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
