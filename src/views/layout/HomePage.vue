<script setup>
// 当该页面DOM被销毁时，回到该页面会执行同步代码。当页面DOM被缓存不需要重新加载时，不会执行
// 当整个页面被关闭或刷新时，pinia会重新执行

import { inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// 浏览器高度
const winHeight = ref(inject('winHeight') - 60 + 'px')

// 搜索栏组件
// 点击搜索栏事件
const handleSearchClick = () => {
  router.push('/search')
}

// 轮播图组件
import { swiperGetService } from '@/api/swiper'
// 轮播图存储数组
const sweiperImg = ref([])
// 获取轮播图数据
onMounted(async () => {
  const { data } = await swiperGetService()
  sweiperImg.value = data[0].imageUrl
})

// 分类标签跳转事件
const categoryClick = (e) => {
  router.push({
    path: '/searchlist',
    query: { category: e.target.innerText }
  })
}

// 商品卡片组件
import { goodsGetService } from '@/api/goods'
const allGoodsList = ref([])
// 取出loadingNum条作为渲染数据
onMounted(async () => {
  const { data } = await goodsGetService()
  allGoodsList.value = data
  GoodsListPush(goodsIndex, goodsIndex + loadingNum)
})

// 点击商品卡片跳转商品详情页
const toDetail = (e) => {
  router.push({
    name: 'ProductDetailPage',
    params: { id: e.currentTarget.dataset.id }
  })
}

import { onActivated, nextTick } from 'vue'
// 定义下滑距离记录
let scroll = 0
// 距离底部距离
let distanceToBottom = 0
// 下滑触发事件
const homeScroll = (e) => {
  // 对目标下滑容器的下滑距离赋值给下滑距离记录变量
  scroll = e.target.scrollTop
  // 计算距离底部的可滑动距离
  distanceToBottom =
    e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop)
  // 距离小于10px时，触发加载函数
  if (distanceToBottom < 10) {
    goodsLoadingFn()
  }
  // 刷新dom后，解开刷新锁
  nextTick(() => (loadMoreConfig = false))
}

// 绑定下滑容器
const scrollContainer = ref(null)
// 回到页面且在缓存的条件下，将下滑距离记录赋值给绑定的下滑容器
onActivated(() => {
  scrollContainer.value.scrollTop = scroll
})

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
// 追加数据到readyGoodsList函数
const GoodsListPush = (preIndex, nextIndex) => {
  readyGoodsList.value.push(...allGoodsList.value.slice(preIndex, nextIndex))
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
  // 获取渲染数据
  // 小于十条且大于零则获取剩余即可
  if (allGoodsList.value.length - goodsIndex < loadingNum) {
    // 没数据了，激活死锁
    lock = true
    // 更改尾部块文案
    footText.value = '到底了......'
    if (allGoodsList.value.length - goodsIndex === 0) return
    GoodsListPush(goodsIndex, allGoodsList.value.length)
  } // 大于等于十条，直接获取十条给渲染数组
  else {
    GoodsListPush(goodsIndex, goodsIndex + loadingNum)
  }
}
</script>

<template>
  <div
    class="home"
    ref="scrollContainer"
    :style="{ height: winHeight }"
    @scroll="homeScroll($event)"
  >
    <!-- 顶部栏组件 -->
    <TopBar>木子商城</TopBar>

    <!-- 搜索栏组件 -->
    <SearchBar @click="handleSearchClick" :isFixed="true"></SearchBar>

    <!-- 轮播图骨架图 -->
    <div v-if="sweiperImg.length === 0" class="ProSwiperSkeleton">
      <div class="skeletonSpaceOne"></div>
      <div class="skeletonSpaceTwo"></div>
    </div>
    <!-- 轮播图组件 -->
    <ProSwiper
      v-else
      class="proSwiper"
      :imgArray="sweiperImg"
      duration="4000"
      mainWidth="94.66vw"
      mainHeight="53.33vw"
    ></ProSwiper>

    <!-- 分类模块 -->
    <ul class="category">
      <li class="category-box">
        <div class="txt"><h1 @click="categoryClick($event)">日用</h1></div>
      </li>
      <li class="category-box">
        <div class="txt"><h1 @click="categoryClick($event)">护肤</h1></div>
      </li>
      <li class="category-box">
        <div class="txt"><h1 @click="categoryClick($event)">男装</h1></div>
      </li>
      <li class="category-box">
        <div class="txt"><h1 @click="categoryClick($event)">女装</h1></div>
      </li>
      <li class="long-category-box">
        <div class="txt"><h1 @click="categoryClick($event)">数码产品</h1></div>
      </li>
      <li class="long-category-box">
        <div class="txt"><h1 @click="categoryClick($event)">家用电器</h1></div>
      </li>
    </ul>

    <!-- 列表骨架图组件 -->
    <ProductSkeleton
      class="proBoxSkelenton"
      :skeleton="loadingNum"
      v-if="allGoodsList.length === 0"
    ></ProductSkeleton>
    <!-- 列表展示模块 -->
    <div class="proBox" v-else>
      <!-- 商品卡片组件 -->
      <ProductCard
        class="proCart"
        v-for="item in readyGoodsList"
        :key="item.id"
        :goods="item"
        :data-id="item.id"
        @click="toDetail($event)"
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
    </div>

    <!-- 尾部块 -->
    <div class="damp">{{ footText }}</div>
  </div>
</template>

<style lang="less" scoped>
.home {
  overflow: scroll;
  background-color: rgba(241, 243, 241);

  .proSwiper {
    margin: 10px;
  }
  .ProSwiperSkeleton {
    margin: 10px;
    width: 355px;
    height: 200px;
    background-color: rgba(226, 226, 226, 0.7);
    border-radius: 10px;
    overflow: hidden;
    .skeletonSpaceOne {
      position: relative;
      border-radius: 10px;
      margin: 30px 0 0 50px;
      width: 100px;
      height: 60px;
      background: linear-gradient(
        155deg,
        rgb(241, 241, 241),
        rgb(211, 211, 211)
      );
      animation: swiperSkeleton 10s infinite;
    }
    .skeletonSpaceTwo {
      border-radius: 10px;
      margin: 20px 0 0 120px;
      width: 200px;
      height: 60px;
      background: linear-gradient(
        155deg,
        rgb(241, 241, 241),
        rgb(211, 211, 211)
      );
      animation: skeleton 6s infinite;
    }
  }

  .category {
    display: flex;
    flex-wrap: wrap;
    margin: 12px 10px;
    width: 352px;
    height: 112px;
    .category-box {
      margin-right: 10px;
      height: 50px;
      width: 80.5px;
      background-color: rgba(255, 255, 255, 0.6);
      border-radius: 10px;
      text-align: center;
      line-height: 50px;
      h1 {
        font-size: 20px;
        font-family: 'Songti SC', 'STSong', 'PMingLiU', serif;
        font-weight: 700;
      }
    }
    .category-box:nth-child(4) {
      margin-right: 0;
    }
    .long-category-box {
      margin-top: 12px;
      width: 171px;
      height: 50px;
      background-color: rgba(255, 255, 255, 0.6);
      border-radius: 10px;
      text-align: center;
      line-height: 50px;
      h1 {
        font-size: 20px;
        font-family: 'Songti SC', 'STSong', 'PMingLiU', serif;
        font-weight: 700;
      }
    }
    .long-category-box:nth-child(5) {
      margin-right: 10px;
    }
  }

  .proBox {
    margin: 10px 12.5px 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .proBoxSkeleton {
    margin: 10px 12.5px 10px;
  }

  .damp {
    height: 70px;
    line-height: 50px;
    text-align: center;
    color: rgb(159, 159, 159);
  }
}

// 骨架图动画
@keyframes swiperSkeleton {
  50% {
    width: 160px;
  }
}
</style>
