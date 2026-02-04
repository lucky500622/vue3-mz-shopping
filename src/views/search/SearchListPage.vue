<script setup>
import { onMounted, ref, nextTick, inject } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
// 浏览器高度
const winHeight = ref(inject('winHeight') + 'px')

// 存储全部商品数据
const allGoodsList = ref([])
// 降序商品数据
const downSortGoodsList = ref([])
// 升序商品数据
const upSortGoodsList = ref([])

import { goodsGetService } from '@/api/goods'
// 匹配的商品数组
const metaGoods = ref([])
onMounted(async () => {
  // 获取全部商品数据
  const { data } = await goodsGetService()
  allGoodsList.value = data
  // 获取与路由传入值匹配的商品
  metaGoods.value = allGoodsList.value.filter((item) => {
    return checkType(item)
  })
  GoodsListPush(goodsIndex, goodsIndex + loadingNum)
})

// 绑定主滚动容器
const home = ref(null)
// 定义一次加载的数量
const loadingNum = 10
// 上拉加载锁
let loadMoreConfig = false
// 加载死锁
let lock = false
// 商品数组取用索引值
let goodsIndex = 0
// 底部文案
const footText = ref('加载更多内容......')
// 用于渲染的商品数据数组
const readyGoodsList = ref([])

// 判断传入类型(query查分类名，params查商品名)
const checkType = (item) => {
  if (!route.query.name) {
    return item.category.includes(route.query.category)
  } else return item.name.includes(route.query.name)
}
// 追加数据到readyGoodsList函数
const GoodsListPush = (preIndex, nextIndex) => {
  // 追加数组
  readyGoodsList.value.push(...metaGoods.value.slice(preIndex, nextIndex))
  if (metaGoods.value.length <= loadingNum) footText.value = '到底了......'
}

// 点击激活状态控制变量
const isActive = ref(1)
// 定义当前排序类型
let defaultConfig = true
let upConfig = false
let downConfig = false
// 排序类型变化重置函数
const leaveBlank = () => {
  // 排序不同，要置空
  readyGoodsList.value = []
  goodsIndex = 0
  // 回到顶部
  home.value.scrollTop = 0
  // 重置加载死锁
  lock = false
  // 重置尾部块文案
  footText.value = '加载更多内容......'
}
// 展示综合排序/默认排序函数
const defaultSort = () => {
  // 排序类型改变，置空
  if (!defaultConfig) {
    leaveBlank()
  } // 排序类型相同return，避免二次点击
  else return
  // 设置当前排序类型
  defaultConfig = true
  upConfig = false
  downConfig = false
  // 寻找匹配项
  metaGoods.value = allGoodsList.value.filter((item) => {
    return checkType(item)
  })
  // 追加
  GoodsListPush(goodsIndex, goodsIndex + loadingNum)
  // 更新激活active状态
  isActive.value = 1
}
// 展示商品数组升序函数
import { goodsGetAscService } from '@/api/goods'
const upSort = async () => {
  // 还没有存储时，获取升序商品数据
  if (upSortGoodsList.value.length === 0) {
    const { data } = await goodsGetAscService()
    upSortGoodsList.value = data
  }
  if (!upConfig) {
    leaveBlank()
  } else return
  upConfig = true
  defaultConfig = false
  downConfig = false
  metaGoods.value = upSortGoodsList.value.filter((item) => {
    return checkType(item)
  })
  GoodsListPush(goodsIndex, goodsIndex + loadingNum)
  // 更新激活active状态
  isActive.value = 2
}
// 展示商品数组降序函数
import { goodsGetDescService } from '@/api/goods'
const downSort = async () => {
  if (downSortGoodsList.value.length === 0) {
    const { data } = await goodsGetDescService()
    downSortGoodsList.value = data
  }
  if (!downConfig) {
    leaveBlank()
  } else return
  downConfig = true
  defaultConfig = false
  upConfig = false
  metaGoods.value = downSortGoodsList.value.filter((item) => {
    return checkType(item)
  })
  GoodsListPush(goodsIndex, goodsIndex + loadingNum)
  // 更新激活active状态
  isActive.value = 3
}

// 距离底部距离
let distanceToBottom = 0
// 下滑触发事件
const homeScroll = (e) => {
  // 计算距离底部的可滑动距离
  distanceToBottom =
    e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop)
  // 距离小于10px时，触发加载函数
  if (distanceToBottom < loadingNum) {
    goodsLoadingFn()
  }
  // 刷新dom后，解开刷新锁
  nextTick(() => (loadMoreConfig = false))
}
// 滚动触底商品加载函数
const goodsLoadingFn = () => {
  // 正在刷新return
  if (lock) return
  if (loadMoreConfig) return
  // 置刷新锁为启用状态
  loadMoreConfig = true
  // 更新索引值，每次loadingNum条
  goodsIndex += loadingNum
  // 传值数组
  const array = ref([])
  // 根据当前排序类型变更传值数组
  if (defaultConfig) array.value = allGoodsList.value
  if (upConfig) array.value = upSortGoodsList.value
  if (downConfig) array.value = downSortGoodsList.value
  // 获取渲染数据
  // 小于十条且大于零则获取剩余即可
  if (array.value.length - goodsIndex < loadingNum) {
    // 更改尾部块文案
    footText.value = '到底了......'
    // 没数据了，激活死锁
    lock = true
    if (array.value.length - goodsIndex === 0) return
    GoodsListPush(goodsIndex, array.value.length)
  } // 大于等于十条，直接获取十条给渲染数组
  else {
    GoodsListPush(goodsIndex, goodsIndex + loadingNum)
  }
}

import { useRouter } from 'vue-router'
const router = useRouter()
// 点击商品卡片跳转商品详情页
const toDetail = (e) => {
  router.push({
    name: 'ProductDetailPage',
    params: { id: e.currentTarget.dataset.id }
  })
}
</script>

<template>
  <div
    class="home"
    ref="home"
    :style="{ height: winHeight }"
    @scroll="homeScroll($event)"
  >
    <!-- 顶部栏 -->
    <TopBar>木子商城</TopBar>

    <!-- 筛选栏 -->
    <div class="filterBar">
      <div @click="defaultSort" class="txt" :class="{ active: isActive === 1 }">
        综合<van-icon name="bar-chart-o" />
      </div>
      <div class="txt">价格<van-icon name="filter-o" /></div>
      <div @click="upSort" class="txt" :class="{ active: isActive === 2 }">
        递增 +
      </div>
      <div @click="downSort" class="txt" :class="{ active: isActive === 3 }">
        递减 -
      </div>
    </div>
    <!-- 筛选栏的占位块 -->
    <div class="space"></div>

    <!-- 商品列表骨架图组件 -->
    <ProductSkeleton
      class="skeleton"
      :skeleton="readyGoodsList.length"
      v-if="readyGoodsList.length === 0"
    ></ProductSkeleton>
    <!-- 匹配的商品列表 -->
    <ul v-else class="goodsList">
      <ProductCard
        @click="toDetail"
        class="proCart"
        v-for="item in readyGoodsList"
        :key="item.id"
        :data-id="item.id"
      >
        <!-- 商品图 -->
        <template v-slot:proimg
          ><img loading="lazy" :src="item.imgUrl" alt=""
        /></template>
        <!-- 商品名 -->
        <template v-slot:proname>{{ item.name }}</template>
        <!-- 商品价格 -->
        <template v-slot:proprice>{{ item.price }}</template>
      </ProductCard>
    </ul>

    <div class="damp">{{ footText }}</div>
  </div>
</template>

<style lang="less" scoped>
.home {
  height: 667px;
  overflow: scroll;
  .filterBar {
    display: flex;
    position: fixed;
    height: 50px;
    width: 100%;
    background: rgb(255, 255, 255);
    box-shadow: 0 0 10px rgb(210, 210, 210);
    .txt:first-child {
      border-right: 1px solid rgb(200, 200, 200);
    }
    .txt {
      width: 25%;
      height: 50px;
      text-align: center;
      line-height: 50px;
    }
    .active {
      color: rgb(255, 111, 0);
      * {
        color: rgb(255, 111, 0);
      }
    }
  }
  .space {
    height: 50px;
  }
  .goodsList {
    margin: 10px 12.5px 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    li {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
    }
  }
  .damp {
    height: 70px;
    line-height: 50px;
    text-align: center;
    color: rgb(159, 159, 159);
  }
  .skeleton {
    margin: 10px 12.5px 10px;
  }
}
</style>
