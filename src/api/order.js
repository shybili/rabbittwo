// 订单api的获取
import request from '@/utils/request'

/**
 * 获取结算信息
 */
export const findCheckoutList = () => {
  return request('/member/order/pre', 'get')
}

/**
 * 添加收货地址
 * @param {Object} form - 对象
 */
 export const addAddress = (form) => {
  return request('/member/address', 'post', form)
}

/**
 * 修改收货地址
 * @param {Object} form - 参考接口文档
 */
 export const editAddress = (form) => {
  return request(`/member/address/${form.id}`, 'put', form)
}

/**
 * 结算页面-提交订单
 * @param {Object} params - 参考接口文档
 * @returns
 */
 export const submitOrder = (params) => {
  return request('/member/order', 'post', params)
}

/**
 * 获取订单详情
 * @param {String} id - 订单ID
 */
 export const findOrderList = (orderid) => {
  return request('/member/order/' + orderid, 'get')
}