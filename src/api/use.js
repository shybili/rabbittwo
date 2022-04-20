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

/**
 * 获取QQ登录的openid
 * @param {String} unicode  QQ唯一标识，openId
 * @param {String} source - 客户端类型 1:PC
 * @returns promise
 */
 export const useQQLogin = ({unicode,source=1}) => {
  return request('/login/social' ,'post' , {unicode,source})
}

/**
 * 获取手机验证码
 * @param {String} mobile 手机号
 * @returns promise
 */
 export const userQQLoginCode = (mobile) => {
  return request('/login/social/code', 'get', { mobile })
}

/**
 * QQ登录-绑定帐号
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns
 */
 export const userQQBindLogin = ({ unionId, mobile, code }) => {
  return request('/login/social/bind', 'post', { unionId, mobile, code })
}

/**
 * 校验帐号是否存在
 * @param {String} account - 帐号
 * @returns Promise
 */
 export const userCheckAccount = (account) => {
  return request('/register/check', 'get', { account })
}

/**
 * 获取QQ完善信息的时候短信验证码
 * @param {String} mobile - 手机号
 * @returns promise
 */
 export const userQQPatchCode = (mobile) => {
  return request('/register/code', 'get', { mobile })
}

/**
 * QQ登录-完善信息
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @param {String} account - 帐号
 * @param {String} password - 密码
 * @returns
 */
export const userQQPatchLogin = ({ unionId, mobile, code, account, password }) => {
  return request(`/login/social/${unionId}/complement`, 'post', { unionId, mobile, code, account, password })
}