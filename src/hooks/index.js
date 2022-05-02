// 提供复用逻辑的函数（钩子）
import { useIntersectionObserver ,useIntervalFn } from '@vueuse/core'
import { onUnmounted, ref } from 'vue'
import dayjs from 'dayjs'

/**
 * 数据懒加载函数
 * @param {Element} target - Dom对象
 * @param {Function} apiFn - API函数:他是一个获取数据的promise函数
 */
export const useLazyData = (apiFn) => {
  const target = ref(null)
  const result = ref([])
  // stop 停止观察
  const { stop } = useIntersectionObserver(
    // 监听的目标元素
    target,
    // eslint-disable-next-line
    ([{ isIntersecting }],observerElement) => {
      // isIntersecting 是否进入可视区
      if (isIntersecting) {
        console.log('进入可视区');
        stop()
        // 调用API函数获取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    // 配置选项，相交的比例大于0就触发
    {
      threshold: 0
    }
  )
  return { result, target }
}

/**
 * 支付倒计时函数
 */
export const usePayTime = () => {
  // 倒计时逻辑
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) {
      pause()
    }
  }, 1000, false)
  onUnmounted(() => {
    pause()
  })
  // 开启定时器 countdown 倒计时时间
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }

  return {
    start,
    timeText
  }
}
