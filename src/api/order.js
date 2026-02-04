import request from '@/utils/request'

// 获取订单信息
export const orderGetService = (id) => {
  return request.get(`/order/${id}`)
}

// 更新订单信息
export const orderSetService = (id, array) => {
  return request.patch(`/order/${id}`, {
    id,
    AllOrder: array
  })
}

// 初始化订单
export const orderInitService = (id) => {
  return request.post('/order', {
    id,
    AllOrder: []
  })
}
