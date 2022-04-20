<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form class="form"  :validation-schema="schema" v-slot="{errors}" ref="FormCom" >
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.account}" name='account' v-model="form.account" type="text" placeholder="请输入用户名" />
          </div>
          <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{errors.account}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field :class="{error:errors.password}" name='password' v-model="form.password" type="password" placeholder="请输入密码"/>
          </div>
          <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{errors.password}}</div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <!-- name属性值就是校验的规则 -->
            <Field :class="{error:errors.mobile}" name='mobile' v-model="form.mobile" type="text" placeholder="请输入手机号" />
          </div>
          <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{errors.mobile}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field :class="{error:errors.code}" name='code' v-model="form.code" type="text" placeholder="请输入验证码"/>
            <span class="code" @click="send()">{{time === 0 ?'发送验证码':`${time}秒后发送`}}</span>
          </div>
          <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{errors.code}}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as='XtxCheckbox' name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree"><i class="iconfont icon-warning" />{{errors.isAgree}}</div>
      </div>
      <a @click="login()" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>
      <!-- <span id="qqLoginBtn"></span> -->
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import {Form , Field} from 'vee-validate'
import scheme from '@/utils/vee-validate'
import { onUnmounted, watch } from '@vue/runtime-core'
import { userAccountLogin , userMobileLogin ,MobileLogin} from '@/api/use'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import Message from '@/components/library/message'
import { useIntervalFn } from '@vueuse/shared'
// import QC from 'qc'
export default {
  name:'loginForm',
  components:{Form , Field},
  setup () {
    // 切换登录的是否是短信
    const isMsgLogin = ref(false)
    // 默认复选框是同意,定义表单双向绑定方法
    const form = reactive({
      isAgree:true,
      account:null,
      password:null,
      mobile:null,
      code:null
    })
    // vee-validate 校验基本步骤
    // 1. 导入 Form Field 组件 将 form 和 input 进行替换，需要加上name用来指定将来的校验规则函数
    // 2. Field 需要进行数据绑定，字段名称最好和后台接口需要的一致
    // 3. 定义Field的name属性指定的校验规则函数，Form的validation-schema接受定义好的校验规则是对象
    // 4. 自定义组件需要校验必须先支持v-model 然后Field使用as指定为组件名称
    const myschema = {
      account:scheme.account,
      password:scheme.password,
      mobile:scheme.mobile,
      code:scheme.code,
      isAgree:scheme.isAgree,
    }

    const FormCom = ref(null)
    // 切换登录的时候清除数据,切换 短信 与 账户 登录时候清空表单和校验结果,如果用的是v-show校验的，没有消除field组件的，需要使用form 中的提供resetForm()   
    watch(isMsgLogin , () => {
      form.isAgree = true,
      form.account = null,
      form.mobile = null,
      form.password = null,
      form.code = null
    })

    // 登录时候进行校验 ,  Form组件提供了一个 validate 函数作为整体表单校验，返回的是一个promise
    const store = useStore()
    // 获取全局的路由
    const router = useRouter()
    // 获取当前页面的路由
    const route = useRoute()
    const login = async () => {
      const valid = await FormCom.value.validate()
      let data = null
        try {
          if (valid) {
              if(isMsgLogin.value) {
                // **手机号登录
                // 2.1. 准备一个API做手机号登录
                // 2.2. 调用API函数
                // 2.3. 成功：存储用户信息 + 跳转至来源页或者首页 + 消息提示
                // 2.4. 失败：消息提示
                const {mobile , code} = form
                data = await MobileLogin({mobile , code})
              } else {
                // **帐号登录
                // 1. 准备一个API做帐号登录
                // 2. 调用API函数
                // 3. 成功：存储用户信息 + 跳转至来源页或者首页 + 消息提示
                // 4. 失败：消息提示
                // 获取当前的输入框中的账号和密码
                const {account , password} = form
                data = await userAccountLogin({account , password})
              }
                // 存储用户信息
                const { id, account, avatar, mobile, nickname, token } = data.result
                store.commit('user/setName',{ id, account, avatar, mobile, nickname, token })
                // 跳转到来源页或者首页
                router.push(route.query.redirectUrl || '/')
                // 消息提示
                Message({type:'success',text:'登录成功'})
                }
        } catch (error) {         
          // 如果有失败的返回数据，我们就显示失败的原因
          if(error.response.data) {
            Message({ type:'error' , text: error.response.data.message || '登录失败' })
          }
         
        }
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
    const send = async () => {
      const validMobile = myschema.mobile(form.mobile)
      // 校验结果只有ture or 字符串，所以要’===‘
      if(validMobile === true) {
        // 通过，发送信息,这里不需要获取验证码，做个请求就可以了
        // 没有倒计时才可以发送
        if(time.value === 0) {
            await userMobileLogin(form.mobile)
            Message({type:'success',text:'发送成功'})
            time.value = 60
            resume()
          
        } 
      }else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        FormCom.value.setFieldError('mobile' , validMobile)
      }
    }

     // 初始化QQ登录按钮 （官方）
    // 1. 准备span有id = qqLoginBtn
    // 2. QC.Login({btnId:"qqLoginBtn"})
    // 3.主要是获取qq的跳转页面，实现当前页面的跳转
    // onMounted(() => {
    //   QC.Login({btnId:"qqLoginBtn"})
    // })
    return {isMsgLogin ,form ,schema:myschema ,login ,FormCom ,send ,time}
  }
}
</script>

<style scoped lang="less">
  // 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>