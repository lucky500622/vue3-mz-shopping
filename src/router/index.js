import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // 配置路由懒加载
    // 登陆页
    {
      name: 'LoginPage',
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    // 首页架子
    {
      name: 'IndexPage',
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/layout/home',
      children: [
        // 首页
        {
          name: 'HomePage',
          path: '/layout/home',
          component: () => import('@/views/layout/HomePage.vue'),
          meta: { keepAlive: true }
        },
        // 分类页
        {
          name: 'CategoryPage',
          path: '/layout/category',
          component: () => import('@/views/layout/CategoryPage.vue')
        },
        // 购物车页
        {
          name: 'CartPage',
          path: '/layout/cart',
          component: () => import('@/views/layout/CartPage.vue')
        },
        // 个人中心页
        {
          name: 'MinePage',
          path: '/layout/mine',
          component: () => import('@/views/layout/MinePage.vue')
        }
      ]
    },
    // 搜索页
    {
      name: 'SearchPage',
      path: '/search',
      component: () => import('@/views/search/SearchPage.vue')
    },
    // 搜索列表页
    {
      name: 'SearchListPage',
      path: '/searchlist',
      component: () => import('@/views/search/SearchListPage.vue')
    },
    // 详情页
    {
      name: 'ProductDetailPage',
      path: '/prodetail/:id',
      component: () => import('@/views/prodetail/ProductDetailPage.vue')
    },
    // 结算页
    {
      name: 'SettlementPage',
      path: '/account',
      component: () => import('@/views/account/SettlementPage.vue')
    },
    // 支付页
    {
      name: 'FinalPage',
      path: '/final/:code',
      component: () => import('@/views/account/FinalPage.vue')
    },
    // 订单页
    {
      name: 'MyOrderPage',
      path: '/myorder',
      component: () => import('@/views/mine/MyOrderPage.vue')
    },
    // 订单详情页
    {
      name: 'OrderDetailPage',
      path: '/order',
      component: () => import('@/views/order/OrderDetailPage.vue')
    },
    {
      name: 'MyAddressPage',
      path: '/myaddress',
      component: () => import('@/views/mine/MyAddresPage.vue')
    }
  ]
})

import { useUserStore } from '@/store'
// 鉴权页面
const authUrls = ['/account', '/order', '/final', '/myorder', '/myaddress']
// 设置路由守卫
router.beforeEach((to) => {
  // 跳转路由关闭toast
  closeToast()
  const userStore = useUserStore()
  // 非鉴权页面，直接放行
  if (!authUrls.some((url) => to.path.startsWith(url))) {
    return true
  }
  // 鉴权页面查看token，有则放行无则去到login页
  if (userStore.token && userStore.token.trim()) {
    return true
  } else return '/login'
})

export default router
