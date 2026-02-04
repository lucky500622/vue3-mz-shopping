import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartGetService, cartSetService } from '@/api/cart'

export const useCartStore = defineStore('main-cart', () => {
  // 异步获取当前用户购物车信息
  const asyncGetCartGoods = async (token) => {
    const res = await cartGetService(token)
    allCartGoods.value = res.data.cart || []
  }

  // 异步上传当前用户购物车信息
  const asyncPushCartGoods = (token) => {
    cartSetService(token, allCartGoods.value)
  }

  // 全部购物车商品信息
  const allCartGoods = ref([])

  // 移除本地购物车商品信息
  const removeLocalCartGoods = () => {
    allCartGoods.value = []
  }

  // 选中的商品数组
  const isCheckedGoods = computed(() => {
    return allCartGoods.value.filter((item) => {
      return item.isChecked === true
    })
  })
  // 被选中的商品总数
  const isCheckedTotalCount = computed(() => {
    return isCheckedGoods.value.reduce((sum, item) => {
      return sum + item.count
    }, 0)
  })
  // 被选中的商品总价
  const isCheckedTotalPrice = computed(() => {
    return isCheckedGoods.value
      .reduce((sum, item) => {
        return sum + item.count * item.price
      }, 0)
      .toFixed(2)
  })

  // 新增购物车商品
  const addCartGoods = async (token, goodsObj) => {
    allCartGoods.value.push(goodsObj)
    // 更新jsonserver购物车信息
    await asyncPushCartGoods(token)
  }

  // 单独增加某一项商品数量
  const addOneCartGoodsCount = async (token, goodsId, count) => {
    allCartGoods.value.forEach((item) => {
      if (item.id === goodsId) {
        item.count += count
      }
    })
    await asyncPushCartGoods(token)
  }

  // 单独修改某一项商品的数量
  const setOneCartGoodsCount = async (token, goodsId, count) => {
    allCartGoods.value.forEach((item) => {
      if (item.id === goodsId) {
        item.count = count
      }
    })
    await asyncPushCartGoods(token)
  }

  // 删除选中的商品操作
  const delCartGoods = async (token) => {
    allCartGoods.value = allCartGoods.value.filter((item) => {
      return item.isChecked === false
    })
    await asyncPushCartGoods(token)
  }

  // 全部购物车数据项的isChecked重置为true
  const resetCartIsChecked = () => {
    allCartGoods.value.forEach((item) => {
      item.isChecked = true
    })
  }

  return {
    allCartGoods,
    isCheckedGoods,
    isCheckedTotalCount,
    isCheckedTotalPrice,
    removeLocalCartGoods,
    asyncGetCartGoods,
    asyncPushCartGoods,
    addCartGoods,
    addOneCartGoodsCount,
    setOneCartGoodsCount,
    resetCartIsChecked,
    delCartGoods
  }
})
