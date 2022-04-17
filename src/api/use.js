// 用户相关的接口
import request from "@/utils/request"

/**
 * 获取登录账号和密码的接口
 * @param {String} account 账号
 * @param {String} password  密码
 * @returns promise
 */
export const userAccountLogin = ({account , password}) => {
  return request('/login' ,'post' ,{account , password})
}

/**
 * 获取手机验证码
 * @param {String} mobile 手机号
 * @returns promise
 */
 export const userMobileLogin = (mobile) => {
  return request('/login/code' ,'get' , {mobile})
}

/**
 * 获取手机验证码
 * @param {String} mobile 手机号
 * @param {String} code  验证码
 * @returns promise
 */
 export const MobileLogin = ({mobile,code}) => {
  return request('/login/code' ,'post' , {mobile,code})
}