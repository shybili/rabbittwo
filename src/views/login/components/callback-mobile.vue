<template>
  <Form ref="FormCom" class="xtx-form" v-slot="{errors}" :validation-schema='mySchema'>
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{nickname}} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err:errors.mobile}" v-model="form.mobile" name='mobile' class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div class="error" v-if="errors.mobile">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err:errors.code}" v-model="form.code" name='code' class="input" type="text" placeholder="短信验证码" />
        <span @click="send()" class="code">{{time === 0 ?'发送验证码':`${time}秒后发送`}}</span>
      </div>
      <div class="error" v-if="errors.code">{{errors.code}}</div>
    </div>
    <a @click="submit()" href="javascript:;" class="submit">立即绑定</a>
  </Form>
</template>

<script>
import { reactive, ref  } from '@vue/reactivity'
import {Form ,Field} from 'vee-validate'
import scheme from '@/utils/vee-validate'
import QC from 'qc'
import { userQQLoginCode ,userQQBindLogin } from '@/api/use'
import {useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/message'
import { onUnmounted } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
export default {
  name: 'CallbackBind',
  components:{ Form , Field },
  props:{
    unionId:{
      type:String,
      default:''
    }
  },
  setup (props) {
    // 1. 准备下信息：unionId(openId) qq头像 昵称
    // 2. 完成表单校验
    // 3. 发送验证吗（校验，定义api，调用，完成倒计时）
    // 4. 进行绑定（绑定成功就是登录成功）
    const nickname = ref('null')
    const avatar = ref('null')
    // 检查是否登录成功
    if(QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        // console.log(res);
        avatar.value = res.data.figureurl_qq_1
        nickname.value = res.data.nickname
      })
    }

    // 完成表单的数据绑定
    const form = reactive({
      mobile: null,
      code: null
    })

    // 完成表单的校验
    const mySchema = {
      mobile: scheme.mobile ,
      code : scheme.code
    }

  // 倒计时的逻辑 用vueuse 里面的useIntervalFn()
    // pause 暂停 resume 开始
    // useIntervalFn(回调函数,执行间隔,是否立即开启)
    const time = ref(0)
    const {pause , resume} = useIntervalFn(() => {
      time.value --
      if(time.value <= 0)
      pause()
    },1000,false)
    // 用完之后要关闭
    onUnmounted(() => {
      pause()
    })

    // 1. 发送验证码
    // 1.1 绑定发送验证码按钮点击事件
    // 1.2 校验手机号，如果成功才去发送短信（定义API），请求成功开启60s的倒计时，不能再次点击，倒计时结束恢复
    // 1.3 如果失败，失败的校验样式显示出来
    const FormCom = ref(null)
    const send = async () => {
      const validMobile = mySchema.mobile(form.mobile)
      // 校验结果只有ture or 字符串，所以要’===‘
      if(validMobile === true) {
        // 通过，发送信息,这里不需要获取验证码，做个请求就可以了
        // 没有倒计时才可以发送
        if(time.value === 0) {
            await userQQLoginCode(form.mobile)
            Message({type:'success',text:'发送成功'})
            time.value = 60
            resume()
          
        } 
      }else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        FormCom.value.setFieldError('mobile' , validMobile)
      }
    }

    // QQ绑定
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const submit = async () => {
      // 做整体表单校验
      const valid = FormCom.value.validate()
      if(valid) {
        await userQQBindLogin({
         unionId: props.unionId,
         ...form
        }).then(data => {
          // 存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setName',{ id, account, avatar, mobile, nickname, token })
          // 跳转到来源页或者首页
          router.push(route.query.redirectUrl || '/')
          // 消息提示
          Message({type:'success',text:'QQ绑定成功'})
        }).catch(error => {
           // 如果有失败的返回数据，我们就显示失败的原因
          if(error.response.data) {
            Message({ type:'error' , text: error.response.data.message || '绑定失败' })
          }
        })
      }
    }

    return { nickname , avatar ,form ,mySchema ,time ,FormCom ,send ,submit}
  }
}
</script>

<style scoped lang='less'>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
      background: #f2f2f2;
      width: 50px;
      height: 50px;
    }
    p {
      padding-left: 10px;
    }
  }
  .code {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 50px;
    width: 80px;
    color: #999;
    &:hover {
      cursor: pointer;
    }
  }
</style>