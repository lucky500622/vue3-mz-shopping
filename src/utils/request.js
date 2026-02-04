import axios from 'axios'
import { myShowToast } from '@/utils/my-Toast'
import { myShowLoadingToast } from '@/utils/my-Toast'

const baseURL = 'http://localhost:3727/'

const instance = axios.create({
  baseURL,
  timeout: 5000
})

// 定义不需要loadingtoast的路由路径
const definePath = [
  '/swiperImages',
  '/goods',
  '/goods?_sort=-price',
  '/goods?_sort=price'
]
// 请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 不包含definePath时加入loadingToast到拦截器
    if (!definePath.includes(config.url)) {
      myShowLoadingToast()
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 正常业务进行，关闭loading
    closeToast()
    return response
  },
  function (error) {
    // 错误情况，关闭loading
    closeToast()
    // 找不到jsonserver
    if (error.code === 'ERR_NETWORK') myShowToast(error.message, 2000)
    // 提示超时
    if (error.code === 'ECONNABORTED') myShowToast('请求超时，请稍后重试', 2000)
    return Promise.reject(error)
  }
)

export default instance
export { baseURL }
