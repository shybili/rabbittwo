// 购物车的接口
import request from "@/utils/request"


/**
 * 获取商品的 最新价格  库存  是否有效
 * @param {String} skuId - SKU id
 */
 export const getNewCartGoods = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'get')
}

/**
 * 获取商品的specs和skus
 * @param {String} skuId - 商品SKUID
 * @returns Promise
 */
export const getGoodSku = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'get')
}

/**
 * 合并本地购物车
 * @param {Array<object>} cartList - 本地购物车数组
 * @param {String} item.skuId - 商品SKUID
 * @param {Boolean} item.selected - 是否选中
 * @param {Integer} item.count - 数量
 */
 export const mergeLocalCart = (cartList) => {
  return request('/member/cart/merge', 'post', cartList)
}
/**
 * 获取登录后的商品列表
 * @returns 
 */
export const findCartList = () => {
  return request('/member/cart' , 'get')
}

/**
 * 加入登录后购物车列表
 */
 export const insertCart = ({skuId , count}) => {
  return request('/member/cart' , 'post' ,{skuId , count} )
}

/**
 * 登陆后删除商品（支持批量删除）
 * @param {Array<string>} ids - skuId集合
 * @returns Promise
 */
 export const deleteCart = (ids) => {
  return request('/member/cart', 'delete', {ids})
}

/**
 * 修改购物车商品的状态和数量
 * @param {String} goods.skuId - 商品sku
 * @param {Boolean} goods.selected - 选中状态
 * @param {Integer} goods.count - 商品数量
 * @returns Promise
 */
export const updateCart = ({skuId , selected , count}) => {
  return request(`/member/cart/${skuId}`, 'put', {selected , count})
}

/**
 * 全选反选
 * @param {Boolean} selected - 选中状态
 * @param {Array<string>} ids - 有效商品skuId集合
 * @returns Promise
 */
 export const selsctAllCart = ({ selected, ids }) => {
  return request('/member/cart/selected', 'put', { selected, ids })
}
