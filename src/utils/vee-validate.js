// 校验规则
export default {
  // 用户名校验
  account (newvalue) { 
    if(!newvalue) return '请输入用户名'
    if(!/^[a-zA-Z]\w{5,19}$/.test(newvalue)) return '请输入首为字母且6-20个字符之间'
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