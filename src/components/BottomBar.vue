<script setup>
// ## 2. 底部栏Bar
// ### 2.1 说明
// 1. 该组件为4处分类的具名插槽封装，支持自定义图标icon以及文字内容text，支持自定义跳转路由
// 2. 可通过v-slot:one/two/three/four-icon传入icon图标，例v-slot:one-icon
// 3. 可通过v-slot:one/two/three/four-text传入text文字内容，例v-slot:one-text
// 4. 可设置跳转路由（规定传递String），属性（one/two/three/fourRouterGo），例oneRouterGo="/layout/home"
// ### 2.2 功能
// 1. 点击对于bar跳转路由
// 2. 点击激活状态active，改变对应的图标及文字颜色

import { ref, defineProps, onMounted } from 'vue'

// 获取路由指定跳转位置
const props = defineProps({
  oneRouterGo: {
    type: String,
    required: true
  },
  twoRouterGo: {
    type: String,
    required: true
  },
  threeRouterGo: {
    type: String,
    required: true
  },
  fourRouterGo: {
    type: String,
    required: true
  },
  existSpace: {
    type: Boolean,
    default: false
  }
})

// 当前bar索引
const currentIndex = ref(0)

import { useRoute } from 'vue-router'
const route = useRoute()
// 检测路由，给bar索引赋值
onMounted(() => {
  if (route.path.includes(props.oneRouterGo)) currentIndex.value = 1
  else if (route.path.includes(props.twoRouterGo)) currentIndex.value = 2
  else if (route.path.includes(props.threeRouterGo)) currentIndex.value = 3
  else if (route.path.includes(props.fourRouterGo)) currentIndex.value = 4
})

import { useRouter } from 'vue-router'
const router = useRouter()
// 点击bar触发事件
const handleClickBar = (e) => {
  const currentClassName = e.currentTarget.className
  // 点击第一个时
  if (currentClassName.includes('one')) {
    // 设置当前bar索引
    currentIndex.value = 1
    // 跳转路由
    router.replace(`${props.oneRouterGo}`)
  }
  if (currentClassName.includes('two')) {
    currentIndex.value = 2
    router.replace(`${props.twoRouterGo}`)
  }
  if (currentClassName.includes('three')) {
    currentIndex.value = 3
    router.replace(`${props.threeRouterGo}`)
  }
  if (currentClassName.includes('four')) {
    currentIndex.value = 4
    router.replace(`${props.fourRouterGo}`)
  }
}
</script>

<template>
  <div class="main-box">
    <div class="box">
      <div class="main-bar">
        <!-- oneBar -->
        <div
          class="one"
          @click="handleClickBar($event)"
          :class="{ active: currentIndex === 1 }"
        >
          <div class="icon">
            <slot name="one-icon"><van-icon name="wap-home-o" /></slot>
          </div>
          <span class="text"><slot name="one-text">首页</slot></span>
        </div>

        <!-- twoBar -->
        <div
          class="two"
          @click="handleClickBar($event)"
          :class="{ active: currentIndex === 2 }"
        >
          <div class="icon">
            <slot name="two-icon"><van-icon name="apps-o" /></slot>
          </div>
          <span class="text"><slot name="two-text">分类页</slot></span>
        </div>

        <!-- threeBar -->
        <div
          class="three"
          @click="handleClickBar($event)"
          :class="{ active: currentIndex === 3 }"
        >
          <div class="icon">
            <slot name="three-icon"><van-icon name="shopping-cart-o" /></slot>
          </div>
          <span class="text"><slot name="three-text">购物车</slot></span>
        </div>

        <!-- fourBar -->
        <div
          class="four"
          @click="handleClickBar($event)"
          :class="{ active: currentIndex === 4 }"
        >
          <div class="icon">
            <slot name="four-icon"><van-icon name="manager-o" /></slot>
          </div>
          <span class="text"><slot name="four-text">我的</slot></span>
        </div>
      </div>
    </div>
    <div :class="{ space: props.existSpace }"></div>
  </div>
</template>

<style lang="less" scoped>
.box {
  position: fixed;
  bottom: 0;
  z-index: 998;
  .main-bar {
    display: flex;
    justify-content: space-around;
    position: absolute;
    bottom: 0;
    height: 60px;
    width: 375px;
    background-color: #fff;
    border-top: 1px solid rgb(240, 240, 240);
    * {
      color: rgb(28, 28, 28);
    }
    > div {
      width: 16%;
      .icon {
        margin: 0 10px;
        padding-top: 6px;
        height: 40px;
        line-height: 34px;
        font-size: 24px;
        text-align: center;
      }
      .text {
        display: block;
        text-align: center;
        width: 100%;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
      }
    }
    .active {
      * {
        color: rgb(255, 40, 40);
      }
    }
  }
}
.space {
  height: 60px;
}
</style>
