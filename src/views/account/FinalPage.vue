<script setup>
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

// 跳转首页
const toHome = () => {
  router.replace('/layout/home')
}
// 跳转订单页
const toOrder = () => {
  router.replace({
    path: '/order',
    query: {
      code: route.params.code
    }
  })
}
</script>

<template>
  <van-icon class="icon" size="14vw" color="green" name="checked" />
  <div class="top">支付成功</div>
  <div class="tohome" @click="toHome">返回首页</div>
  <div class="toorder" @click="toOrder">查看订单</div>
</template>

<style lang="less" scoped>
.icon {
  position: absolute;
  top: 116px;
  left: 50%;
  transform: translateX(-50%);
}
.top {
  margin: 170px auto 0;
  text-align: center;
  font-size: 20px;
}

.toorder,
.tohome {
  margin: 70px auto 0;
  height: 34px;
  width: 200px;
  border: 1px solid rgb(222, 222, 222);
  border-radius: 10px;
  text-align: center;
  line-height: 34px;
  color: #565656;
  background-color: #ffffff;
}
.toorder {
  margin-top: 30px;
}
</style>
