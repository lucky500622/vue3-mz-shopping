<script setup>
import { myShowToast } from '@/utils/my-Toast'
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
import { goodsGetOneService } from '@/api/goods'
import { useUserStore } from '@/store'
const userStore = useUserStore()
import { useCartStore } from '@/store'
const cartStore = useCartStore()

// 存储对应商品数据
const goodsData = ref({})
// 没有匹配时的返回值
let existMetaGoods = false
// 匹配的商品信息
const metaGoods = computed(() => {
  return (
    // 比对购物车信息，查看是否已经添加过该商品
    cartStore.allCartGoods.find((item) => {
      return item.id === route.params.id
    }) || []
  )
})
// 该商品在购物车的数量
const metaGoodsCount = computed(() => {
  // 添加过则赋existMetaGoods为true，并给匹配的商品数量赋值
  if (metaGoods.value.length !== 0) {
    // 更新existMetaGoods
    existMetaGoods = true
    return metaGoods.value.count
  } else return 0
})
// 进入该页面获取对应商品数据
onMounted(async () => {
  // 获取当前用户的购物车信息
  await cartStore.asyncGetCartGoods(userStore.token)

  // 获取当前页面商品信息
  const { data } = await goodsGetOneService(route.params.id)
  goodsData.value = data
})

import { useRouter } from 'vue-router'
const router = useRouter() //////////////
import { myTologinConfirmToast } from '@/utils/my-Toast'
// 加购数量
const addCount = ref(1)
const showToastConfig = ref(false)
const showBuyToastConfig = ref(false)
// 显示加入购物车弹窗
const showAddToast = () => {
  // 未登录引导登录，中断业务
  if (userStore.token === '') {
    myTologinConfirmToast(
      '登录后才能加入购物车哦',
      '去登录',
      '再逛逛',
      router,
      route
    )
    return
  }
  showToastConfig.value = true
}
// 隐藏加入购物车弹窗
const hideAddToast = () => {
  showToastConfig.value = false
}
// 显示立即购买弹窗
const showBuyToast = () => {
  // 未登录引导登录，中断业务
  if (userStore.token === '') {
    myTologinConfirmToast('登录后才能购买哦', '去登录', '再逛逛', router, route)
    return
  }
  showBuyToastConfig.value = true
}
// 隐藏立即购买弹窗
const hideBuyToast = () => {
  showBuyToastConfig.value = false
}
// 加入购物车功能
const addCart = async () => {
  // 未登录引导登录，中断业务
  if (userStore.token === '') {
    myTologinConfirmToast(
      '登录后才能加入购物车哦',
      '去登录',
      '再逛逛',
      router,
      route
    )
    return
  }
  // 解构商品信息对象
  const { id, name, price, imgUrl } = goodsData.value
  // 发现已有该商品在购物车内，直接加count
  if (existMetaGoods) {
    await cartStore.addOneCartGoodsCount(userStore.token, id, addCount.value)
  } // 还没有添加过，新增一条购物车商品
  else {
    await cartStore.addCartGoods(userStore.token, {
      id,
      name,
      price,
      imgUrl,
      count: addCount.value,
      isChecked: true
    })
  }
  addCount.value = 1
  showToastConfig.value = false
  myShowToast('商品添加成功', 2000)
}
// 立即购买功能
const buyNow = async () => {
  // 未登录引导登录，中断业务
  if (userStore.token === '') {
    myTologinConfirmToast('登录后才能购买哦', '去登录', '再逛逛', router, route)
    return
  }

  // 解构商品信息对象
  const { id } = goodsData.value
  const obj = {
    id,
    count: addCount.value
  }
  showToastConfig.value = false
  router.push({
    path: '/account',
    query: obj
  })
}
</script>

<template>
  <!-- 顶部栏 -->
  <TopBar backgroundColor="rgb(240, 240, 240)" fontColor="rgb(27, 27, 27)"
    >木子商城</TopBar
  >

  <!-- 轮播图 -->
  <ProSwiper
    class="proswiper"
    mainWidth="100vw"
    mainHeight="100vw"
    :imgArray="[goodsData.imgUrl]"
    :nodebox="true"
  ></ProSwiper>

  <!-- 商品详情 -->
  <div class="message">
    <!-- 商品信息 -->
    <div class="saleMessage">
      <div>
        <span class="price-icon">￥</span>
        <span class="price">{{ goodsData.price }}</span>
      </div>
      <span class="text">热销中</span>
    </div>
    <!-- 商品介绍 -->
    <div class="describe">
      <div class="name">{{ goodsData.name }}</div>
      <div class="text">{{ goodsData.text }}</div>
    </div>
  </div>

  <!-- 购物车弹窗背景 -->
  <div class="toast-cover" v-show="showToastConfig">
    <!-- 购物弹窗 -->
    <transition name="slide">
      <div class="toast" v-show="showToastConfig">
        <div class="message">
          <div class="left">
            <img :src="goodsData.imgUrl" alt="" />
          </div>
          <div class="right">
            <div @click="hideAddToast" class="hide">x</div>
            <div class="price"><span>￥</span>{{ goodsData.price }}</div>
            <div class="name">{{ goodsData.name }}</div>
          </div>
        </div>
        <div class="fn-space">
          <!-- 算术栏 -->
          <NumCounter class="counter" v-model:addCount="addCount"></NumCounter>
          <!-- 加入购物车按钮 -->
          <button @click="addCart">加入购物车</button>
        </div>
      </div>
    </transition>
  </div>

  <!-- 立即购买弹窗背景 -->
  <div class="toast-cover" v-show="showBuyToastConfig">
    <!-- 购物弹窗 -->
    <transition name="slide">
      <div class="toast" v-show="showBuyToastConfig">
        <div class="message">
          <div class="left">
            <img :src="goodsData.imgUrl" alt="" />
          </div>
          <div class="right">
            <div @click="hideBuyToast" class="hide">x</div>
            <div class="price"><span>￥</span>{{ goodsData.price }}</div>
            <div class="name">{{ goodsData.name }}</div>
          </div>
        </div>
        <div class="fn-space">
          <!-- 算术栏 -->
          <NumCounter class="counter" v-model:addCount="addCount"></NumCounter>
          <!-- 加入购物车按钮 -->
          <button class="buy-btn" @click="buyNow">立即购买</button>
        </div>
      </div>
    </transition>
  </div>

  <!-- 底部购买栏 -->
  <div class="buyBar">
    <div @click="router.push('/layout/home')" class="home">
      <van-icon size="7vw" name="home-o" />
      <div class="text">首页</div>
    </div>
    <div @click="router.push('/layout/cart')" class="cart">
      <van-icon size="7vw" name="shopping-cart-o" />
      <div class="text">购物车</div>
      <div class="count-node" v-show="metaGoodsCount !== 0">
        {{ metaGoodsCount }}
      </div>
    </div>
    <!-- 购买按钮 -->
    <div class="buy-button">
      <div class="add-cart" @click="showAddToast">加入购物车</div>
      <div class="buyNow" @click="showBuyToast">立即购买</div>
    </div>
  </div>
  <!-- 底部购买栏占位块 -->
  <div class="buyBar-space"></div>
</template>

<style lang="less" scoped>
.proswiper {
  box-shadow: 0 0 10px #9e9e9e;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.saleMessage {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding-left: 14px;
  height: 50px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background: #fcfcfc;
  box-shadow: 0 0 10px #d8d8d8;
  .price-icon,
  .price {
    height: 50px;
    line-height: 50px;
    color: rgba(250, 34, 9, 0.8);
    font-weight: 700;
    font-size: 23px;
  }
  .text {
    margin-right: 20px;
    height: 50px;
    line-height: 50px;
    font-size: 17px;
    color: #ff7300;
  }
}

.describe {
  margin-top: 10px;
  padding: 8px 14px 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background: #fcfcfc;
  box-shadow: 0 0 10px #d8d8d8;
  font-family: 'Songti SC', 'STSong', 'PMingLiU', serif;
  .name {
    font-size: 18px;
    color: #494949;
    font-weight: 700;
  }
  .text {
    margin-top: 3px;
    color: #494949;
  }
}

// 弹窗背景
.toast-cover {
  z-index: 999;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  // 购物弹窗
  .toast {
    margin: 0 10px;
    padding: 20px 0 0 20px;
    position: fixed;
    bottom: 60px;
    background-color: rgba(250, 250, 250);
    border-radius: 10px;
    width: 355px;
    height: 230px;
    transition: all 1s;
    // goods信息
    .message {
      display: flex;
      .left {
        width: 120px;
        height: 120px;
        border-radius: 5px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .right {
        margin-left: 36px;
        width: 160px;
        font-family: 'Songti SC', 'STSong', 'PMingLiU', serif;
        font-weight: 700;
        height: 120px;
        .hide {
          margin-left: 140px;
          width: 20px;
          height: 20px;
          background-color: rgb(233, 233, 233);
          border-radius: 5px;
          text-align: center;
          font-weight: 400;
          font-family: none;
          line-height: 17px;
          font-size: 13px;
        }
        .price {
          line-height: 30px;
          font-size: 20px;
          color: rgba(250, 34, 9, 0.8);
          border-bottom: 1px solid rgb(145, 145, 145);
          span {
            color: rgba(250, 34, 9, 0.8);
            font-size: 17px;
          }
        }
        .name {
          margin-top: 6px;
          line-height: 30px;
          font-size: 17px;
        }
      }
    }
    // 交互部分
    .fn-space {
      display: flex;
      height: 80px;
      justify-content: space-between;
      .counter {
        margin: 36px 0 0 0;
      }
      button {
        margin: 30px 24px 0 0;
        height: 40px;
        width: 160px;
        background-color: rgb(255, 169, 0);
        border: none;
        border-radius: 5px;
        color: rgb(255, 247, 249);
      }
      .buy-btn {
        background-color: rgb(254, 86, 48);
      }
    }
  }
  // 过渡效果
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.5s ease;
  }
  .slide-enter-from {
    transform: translateY(230px);
    opacity: 0;
  }
  .slide-leave-to {
    transform: translateY(230px);
    opacity: 0;
  }
}

// 购买栏
.buyBar {
  display: flex;
  z-index: 998;
  position: fixed;
  bottom: 0;
  padding: 10px 0 0 14px;
  width: 375px;
  height: 60px;
  background-color: rgb(252, 252, 252);
  border-top: 1px solid rgb(217, 217, 217);
  text-align: center;
  .home,
  .cart {
    position: relative;
    height: 40px;
    width: 50px;
    .count-node {
      position: absolute;
      border-radius: 50%;
      padding: 0 4px;
      height: 5px;
      line-height: 5px;
      top: 0;
      right: 6px;
      background-color: rgb(254, 86, 48);
      height: 14px;
      line-height: 14px;
      font-size: 11px;
      color: #f4f4f4;
    }
    .text {
      font-size: 13px;
      color: #656565;
    }
  }

  .buy-button {
    display: flex;
    margin-left: 40px;
    width: 200px;
    justify-content: end;
    border-radius: 5px;
    overflow: hidden;
    text-align: center;
    line-height: 40px;
    * {
      color: #ffffff;
    }
    .add-cart {
      width: 100px;
      height: 40px;
      background-color: rgb(255, 169, 0);
    }
    .buyNow {
      width: 100px;
      height: 40px;
      background-color: rgb(254, 86, 48);
    }
  }
}
.buyBar-space {
  height: 60px;
}
</style>
