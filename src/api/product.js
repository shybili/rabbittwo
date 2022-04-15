// 商品详情的api
import request from '@/utils/request'
/**
 * 
 * @param {string} id 商品id
 * @returns 
 */
export const findGoods = (id) => {
  return request('/goods','get',{ id })
}

/**
 * 获取相关推荐商品|猜你喜欢商品
 * @param {String} id - 商品ID，传入相关推荐，不传猜你喜欢
 * @param {Integer} limit - 商品数量
 */
 export const findRelevantGoods = ({ id, limit = 16 }) => {
  return request('/goods/relevant', 'get', { id, limit })
}

/**
 * 获取热榜商品
 * @param {Number} type - 1代表24小时热销榜 2代表周热销榜 3代表总热销榜
 * @param {Number} limit - 获取个数
 */
export const findGoodsHot = ({id,limit=16,type=1}) => {
  return request('/goods/hot', 'get', {id, type, limit })
}

/**
 * 获取商品的评价统计信息
 * @param {String} id - 商品ID
 */
export const findGoodsComment = (id) => {
   // return request(`/goods/${id}/evaluate`, 'get')
  // axios 遇见 http https 开头的地址，不会加上基准地址
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`,'get')
}

/**
 * 获取商品的评价统计信息
 * @param {String} id - 商品ID
 * @param {Object} param - 请求的是那一个tag列表的
 */
 export const findGoodsCommentList = (id,param) => {
  // return request(`/goods/${id}/evaluate`, 'get')
 // axios 遇见 http https 开头的地址，不会加上基准地址
 return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`,'get',param)
}