import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//导入自己的UI组件库
import UI from '@/components/library'

//引入重置样式
import 'normalize.css'
import '@/assets/styles/common.less'

// 引入模拟接口
import '@/mock'

createApp(App).use(store).use(router).use(UI).mount('#app')
