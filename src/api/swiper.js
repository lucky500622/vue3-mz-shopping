import request from '@/utils/request'

// 获取轮播图url
export const swiperGetService = () => {
  return request.get('/swiperImages')
}
