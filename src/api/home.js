//提供首页相关的api
import request from "@/utils/request";

/**
 * 
 * @param {int} limit 品牌个数
 * @returns 
 */
export const findBrand = (limit = 6) => {
  return request('/home/brand','get',{limit})
}