import request from '@/utils/request'

// 获取历史搜索数据
export const historyGetService = () => {
  return request.get('/historySearch')
}

// 更新已有的历史搜索数据
export const historySetService = (historySearchArray, id) => {
  return request.patch(`/historySearch/${id}`, {
    goodsName: historySearchArray
  })
}

// 初始化历史记录
export const historyInitService = (id) => {
  return request.post('/historySearch', {
    id,
    goodsName: []
  })
}
