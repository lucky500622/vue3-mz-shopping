<script setup>
import { onMounted, ref } from 'vue'
import { orderGetService } from '@/api/order'
import { useRoute } from 'vue-router'
const route = useRoute()
import { useUserStore } from '@/store'
const userStore = useUserStore()

// 订单信息
const orderList = ref({})
onMounted(async () => {
  const {
    data: { AllOrder }
  } = await orderGetService(userStore.token)
  const [obj] = AllOrder.filter((item) => {
    return item.code === route.query.code
  })
  orderList.value = obj
})
</script>

<template>
  <!-- 顶部栏 -->
  <TopBar backgroundColor="rgb(255, 255, 255)" fontColor="rgb(27, 27, 27)"
    >订单详情</TopBar
  >

  <!-- 表单信息栏 -->
  <div class="messageForm">
    <div class="code">
      订单编号：<span>{{ orderList.code }}</span>
    </div>
    <div class="address">收货地址：{{ orderList.address }}</div>
    <div class="bottom">
      <span class="name">姓名：{{ orderList.name }}</span
      ><span class="phone">手机号：{{ orderList.phone }}</span>
    </div>
  </div>

  <!-- 商品列表模块 -->
  <div class="goods-box">
    <div class="goods-card" v-for="item in orderList.goods" :key="item.id">
      <div class="pic"><img :src="item.imgUrl" loading="lazy" alt="" /></div>
      <div class="message">
        <div class="goods-name">{{ item.name }}</div>
        <div class="goods-price">￥{{ item.price }}</div>
        <div class="goods-count">数量：{{ item.count }}</div>
      </div>
    </div>
  </div>

  <!-- 下单时间 -->
  <div class="order-time">下单时间：{{ orderList.time }}</div>

  <!-- 价格明细模块 -->
  <div class="price-message">
    <div class="topbar"><h1>价格明细：</h1></div>
    <ul>
      <li class="goods-message" v-for="item in orderList.goods" :key="item.id">
        <div class="name">{{ item.name }}</div>
        <div class="total-price">￥{{ item.price * item.count }}</div>
      </li>
    </ul>
    <div class="bottom-bar">
      <h1>共计</h1>
      <div class="all-price">￥{{ orderList.totalPrice }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.messageForm {
  margin-top: 10px;
  padding: 20px 10px 0 10px;
  width: 375px;
  height: 106px;
  background-color: rgb(255, 255, 255);
  overflow: hidden;
  * {
    font-size: 14px;
    color: rgb(44, 44, 44);
  }
  div {
    height: 14px;
    line-height: 14px;
    margin-bottom: 12px;
  }
  .editform {
    margin: 0 0 2px 290px;
    width: 80px;
    height: 14px;
    line-height: 14px;
  }
  .bottom {
    .name {
      margin-right: 12px;
    }
  }
}

.goods-box {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
  .goods-card {
    margin-bottom: 10px;
    display: flex;
    height: 100px;
    .pic {
      width: 100px;
      height: 100px;
      border-radius: 5px;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }
    .message {
      margin-left: 20px;
      height: 100px;
      .goods-name {
        margin-top: 4px;
        margin-bottom: 30px;
        height: 24px;
        line-height: 24px;
        font-size: 16px;
      }
      .goods-price {
        height: 20px;
        line-height: 20px;
        font-weight: 700;
        font-size: 16px;
        color: rgb(251, 123, 18);
      }
    }
  }
  .goods-card:nth-child(2n) {
    background-color: #f8f8f8;
  }
}

.order-time {
  margin-top: 10px;
  padding-left: 10px;
  height: 40px;
  background-color: #fff;
  line-height: 40px;
}

.price-message {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
  .topbar {
    height: 40px;
    line-height: 40px;
    h1 {
      font-size: 18px;
    }
  }
  .goods-message {
    padding-right: 10px;
    display: flex;
    justify-content: space-between;
    div {
      height: 30px;
      line-height: 30px;
    }
    .total-price {
      color: rgb(255, 115, 0);
      font-weight: 700;
    }
  }
  .goods-message:nth-of-type(2n) {
    background-color: #f8f8f8;
  }
  .bottom-bar {
    padding-right: 10px;
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    .all-price {
      color: rgb(255, 115, 0);
      font-weight: 700;
      font-size: 17px;
    }
  }
}
</style>
