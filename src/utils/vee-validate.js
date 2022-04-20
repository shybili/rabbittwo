import { userCheckAccount } from '@/api/use'

// 校验规则
export default {
  // 用户名校验
  account (newvalue) { 
    if(!newvalue) return '请输入用户名'
    if(!/^[a-zA-Z]\w{5,19}$/.test(newvalue)) return '请输入首为字母且6-20个字符之间'
    return true
  },
  // 用户名是否村在校验
  async accountApi (newvalue) { 
    if(!newvalue) return '请输入用户名'
    if(!/^[a-zA-Z]\w{5,19}$/.test(newvalue)) return '请输入首为字母且6-20个字符之间'
    const data = await userCheckAccount(newvalue)
    if(data.result.valid) return '用户名已存在'
    return true
  },
  rePassword (value, { form }) {
    if (!value) return '请输入密码'
    if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
    // 校验密码是否一致  form表单数据对象
    if (value !== form.password) return '再次次输入的密码不一致'
    return true
  },
  // 密码校验
  password (newvalue) { 
    if(!newvalue) return '请输入密码'
    if(!/^\w{5,19}$/.test(newvalue)) return '请输入6-20个字符的密码'
    return true
  },
  // 手机号校验
  mobile (newvalue) { 
    if(!newvalue) return '请输入手机号'
    if(!/^1[3-9]\d{9}/.test(newvalue)) return '请输入正确的11位手机号码'
    return true
  },
  // 验证码校验
  code (newvalue) { 
    if(!newvalue) return '请输入验证码'
    if(!/^\d{6}/.test(newvalue)) return '请输入6个验证码'
    return true
  },
  // 勾选协议的校验
  isAgree (newvalue) {
    if(!newvalue) return '请勾选同意协议'
    return true
  }

}