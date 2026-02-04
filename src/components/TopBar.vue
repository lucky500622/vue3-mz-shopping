<script setup>
// ## 3. 顶部栏Bar
// ### 3.1 说明
// 1. 该组件为默认插槽顶部栏标题
// 2. 通过键入文字可改变标题

import { defineProps } from 'vue'
const props = defineProps({
  backgroundColor: {
    type: String,
    default: 'rgb(195, 20, 1)'
  },
  fontColor: {
    type: String,
    default: '#f3f3f3'
  },
  existBackIcon: {
    type: Boolean,
    default: true
  }
})

import { useRouter } from 'vue-router'
const router = useRouter()
// 返回上一页图标
const gobackRouter = () => {
  router.back()
}
</script>

<template>
  <div class="box">
    <!-- bar -->
    <div
      class="main-box"
      :style="{
        backgroundColor: props.backgroundColor,
        color: props.fontColor
      }"
    >
      <div class="txt">
        <div class="back">
          <van-icon
            v-show="existBackIcon"
            @click="gobackRouter"
            :color="fontColor"
            name="arrow-left"
          />
        </div>
        <slot>商城</slot>
      </div>
    </div>
    <!-- 占位块 -->
    <div class="placeholder"></div>
  </div>
</template>

<style lang="less" scoped>
.main-box {
  display: flex;
  position: fixed;
  z-index: 998;
  top: 0;
  width: 375px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  .txt {
    position: relative;
    width: 100%;
    color: inherit;
    text-align: center;
    .back {
      position: absolute;
      width: 60px;
    }
  }
}
.placeholder {
  height: 50px;
}
</style>
