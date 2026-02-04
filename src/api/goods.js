import request from '@/utils/request'

// 定义一个存储promise的map
const cacheMap = new Map()
function setCache(key, promise, ttl) {
  cacheMap.set(key, {
    promise,
    expire: Date.now() + ttl
  })
}
function getCache(key) {
  const item = cacheMap.get(key)
  if (!item) return null
  if (Date.now() > item.expire) {
    cacheMap.delete(key)
    return null
  }
  return item.promise
}

// 获取全部商品数据
export const goodsGetService = () => {
  const promise = getCache('defaultCachePromise')
  // 已有Promise则不再请求
  if (promise) {
    return promise
  }
  console.log()
  // 存异步获取商品数据的promise
  const defaultCachePromise = request
    .get('/goods')
    .then((res) => res)
    .catch((err) => {
      cacheMap.delete('defaultCachePromise')
      throw err
    })
  setCache('defaultCachePromise', defaultCachePromise, 1000 * 60 * 60)
  return defaultCachePromise
}

// 获取全部商品升序数据
export const goodsGetAscService = () => {
  const promise = getCache('ascCachePromise')
  // 已有Promise则不再请求
  if (promise) {
    return promise
  }
  // 存异步获取商品数据的promise
  const ascCachePromise = request
    .get('/goods?_sort=price')
    .then((res) => res)
    .catch((err) => {
      cacheMap.delete('ascCachePromise')
      throw err
    })
  setCache('ascCachePromise', ascCachePromise, 1000 * 60 * 60)
  return ascCachePromise
}

// 获取全部商品升序数据
export const goodsGetDescService = () => {
  const promise = getCache('descCachePromise')
  // 已有Promise则不再请求
  if (promise) {
    return promise
  }
  // 存异步获取商品数据的promise
  const descCachePromise = request
    .get('/goods?_sort=-price')
    .then((res) => res)
    .catch((err) => {
      cacheMap.delete('descCachePromise')
      throw err
    })
  setCache('descCachePromise', descCachePromise, 1000 * 60 * 60)
  return descCachePromise
}

// 随机获取商品数据
export const goodsGetRandomService = (index, range) => {
  return request(`/goods?_start=${index}&_end=${index + range}`)
}

// 获取单个商品数据
export const goodsGetOneService = (id) => {
  return request.get(`/goods/${id}`)
}
