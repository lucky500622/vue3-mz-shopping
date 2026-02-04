import request from '@/utils/request'

// 获取购物车商品数据
export const cartGetService = (id) => {
  return request.get(`/cart/${id}`)
}

// 更新商品到购物车
export const cartSetService = (id, array) => {
  return request.patch(`/cart/${id}`, {
    id,
    cart: array
  })
}

// 初始化购物车
export const cartInitService = (id) => {
  return request.post('/cart', {
    id,
    cart: []
  })
}
