// 个人中心的接口
import request from '@/utils/request'


/**
 * 获取我的收藏
 *@param {Integer} collectType - 收藏类型，1为商品，2为专题，3为品牌
 * @returns Promise
 */
export const findCollect = ({page = 1, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect','get' ,{page, pageSize , collectType})
}


/**
 * 获取我的足迹
 *@param {Integer} collectType - 收藏类型，1为商品，2为专题，3为品牌
 * @returns Promise
 */
 export const findCollectHistory = ({page = 1, pageSize = 10 }) => {
  return request('/member/browseHistory','get' ,{page, pageSize})
}