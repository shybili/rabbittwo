// 定义首页需要的接口函数
import request from '@/utils/request'

/**
 * 获取首页头部分类数据
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}
 
/**
 * 获取单个顶级分类信息（即children信息）
 * @param {String} id - 顶级分类ID
 */
export const findTopcategory = (id) => {
  return request('/category','get', { id })
}

/**
 * 获取分类筛选的数据
 * @param {String} id - 二级分类ID
 */
export const findSubCategoryFilter = (id) => {
  return request('/category/sub/filter','get',{id})
}

export const findSubCategoryGoods = (params) => {
  return request('/category/goods/temporary','post',params)
}