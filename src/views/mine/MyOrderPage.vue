<script setup>
import { onMounted, ref } from 'vue'

import { orderGetService } from '@/api/order'
import { useUserStore } from '@/store'
const userStore = useUserStore()
const orderList = ref([])
// 获取订单信息
onMounted(async () => {
  const {
    data: { AllOrder }
  } = await orderGetService(userStore.token)
  orderList.value = AllOrder
})

import { useRouter } from 'vue-router'
const router = useRouter()
// 访问订单详情功能
const toOrderDetail = (e) => {
  router.push({
    path: '/order',
    query: {
      code: e.target.dataset.code
    }
  })
}

// 删除订单功能
import { orderSetService } from '@/api/order'
const delOrder = (e) => {
  showConfirmDialog({
    message: '确认删除吗'
  })
    .then(async () => {
      const list = orderList.value.filter((item) => {
        return item.code !== e.target.dataset.code
      })
      await orderSetService(userStore.token, list)
      orderList.value = list
    })
    .catch(() => {
      // on cancel
    })
}
</script>

<template>
  <!-- 顶部栏 -->
  <TopBar backgroundColor="rgb(255, 255, 255)" fontColor="rgb(27, 27, 27)"
    >我的订单</TopBar
  >

  <!-- 订单列表 -->
  <ul class="order-list">
    <li v-for="item in orderList" :key="item.code">
      <div @click="toOrderDetail($event)" :data-code="item.code" class="more">
        查看详情>
      </div>
      <div class="code">订单编号：{{ item.code }}</div>
      <div class="time">下单时间：{{ item.time }}</div>
      <div class="total-price">共计消费：{{ item.totalPrice }}</div>
      <div @click="delOrder($event)" :data-code="item.code" class="delete">
        删除订单<van-icon name="delete-o" />
      </div>
    </li>
  </ul>

  <!-- 底部块 -->
  <div class="damp" v-show="orderList.length === 0">您还没有订单哦</div>
</template>

<style lang="less" scoped>
.order-list {
  margin-top: 10px;
  background: #ffffff;
  overflow: hidden;
  li {
    position: relative;
    margin: 30px 10px;
    padding: 16px 10px 10px;
    height: 136px;
    background-color: #f7f7f7;
    border-radius: 5px;
    div {
      height: 30px;
      line-height: 30px;
    }
    .more {
      margin-left: 270px;
      height: 14px;
      line-height: 14px;
      font-size: 13px;
    }
    .delete {
      position: absolute;
      bottom: 10px;
      right: 12px;
      height: 14px;
      line-height: 14px;
      font-size: 13px;
    }
  }
}

.damp {
  margin-top: 10px;
  text-align: center;
  height: 100px;
  line-height: 100px;
  font-size: 17px;
  background-color: #fff;
}
</style>
