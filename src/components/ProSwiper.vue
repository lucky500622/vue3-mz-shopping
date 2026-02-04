<script setup>
// ## 1. 轮播图组件
// ### 1.1 说明
// 1. 该组件为无缝轮播图，若开启显示器，建议不超过9张
// 2. 可通过传入图片URL数组的方式更改图片内容，图片数量不限（规定传递Array），属性（imgArray），例：imgArray="[]"
// 3. 属性可选择是否开启指示器（规定传递Boolean），属性（nodebox），值（true不显示，false显示，默认false）
// 4. 属性可设置轮播间隔时长，不可低于500（规定传递String），属性（duration），例：duration="3000"
// ### 1.2 功能
// 1. 内置指示器，表明当前的图片位置
// 2. 左右按钮控制显示轮播图， 加入节流功能防止频繁点击
// 3. 自动轮播功能，主动点击切换会重置自动轮播倒计时
// 4. 图片全部加载完毕才会触发自动轮播/有一张加载失败也会触发（避免卡着不轮播）

import { ref, defineProps, onUnmounted } from 'vue'

// 接收轮播图数据
const props = defineProps({
  imgArray: {
    type: Array,
    default: () => []
  },
  nodebox: {
    type: Boolean,
    default: false
  },
  duration: {
    type: String,
    default: '5000'
  },
  mainWidth: {
    type: String,
    default: '94.66vw'
  },
  mainHeight: {
    type: String,
    default: '53.33vw'
  }
})

// 拼接图片数据
import { computed } from 'vue'
const jointImg = computed(() => {
  if (props.imgArray.length <= 1) {
    return [props.imgArray, props.imgArray, props.imgArray]
  }
  return [
    props.imgArray[props.imgArray.length - 1],
    ...props.imgArray,
    props.imgArray[0]
  ]
})

// 轮播图索引
const swiperIndex = ref(1)
// 指示器索引
const nodeIndex = ref(1)
// 定义一个动态控制轮播平移距离
const distance = ref('translateX(-100%)')
// 定义一个过度状态切换
const transition = ref('')
// 定义一个控制变量，实现节流
let config = false
// 定时器
let outTimer = null
let interTimer = null
// 指示器盒子赋值
const nodeWidth = computed(() => {
  const imgLength = props.imgArray.length
  if (imgLength === 1) return '2.66vw'
  else if (imgLength < 5) return '26.66vw'
  else if (imgLength < 10) return '53.33vw'
  return '66.66vw'
})

// 点击轮播事件函数
// 上一张
const pre = (arrayLength) => {
  // 点击节流
  if (config) return
  config = true
  outTimer = setTimeout(() => {
    config = false
  }, 500)
  // 改变指示器
  nodeIndex.value--
  if (nodeIndex.value === 0) nodeIndex.value = arrayLength
  // 重置过度效果
  transition.value = 'all 0.5s'
  // 正常轮播
  swiperIndex.value--
  distance.value = `translateX(-${swiperIndex.value * 100}%)`
  // 遇到第一张，设置跳转
  if (swiperIndex.value === 0) {
    setTimeout(() => {
      // 设置轮播图到最后一张，消除过度效果
      transition.value = 'none'
      swiperIndex.value = arrayLength
      distance.value = `translateX(-${swiperIndex.value * 100}%)`
    }, 500)
  }

  // 清除定时器
  interTimer && clearInterval(interTimer)
  // 重开定时器
  interTimer = setInterval(() => {
    next(props.imgArray.length)
  }, +props.duration)
}
// 下一张
const next = (arrayLength) => {
  // 点击节流
  if (config) return
  config = true
  outTimer = setTimeout(() => {
    config = false
  }, 500)
  // 改变指示器
  nodeIndex.value++
  if (nodeIndex.value === arrayLength + 1) nodeIndex.value = 1
  // 重置过度效果
  transition.value = 'all 0.5s'
  // 正常轮播
  swiperIndex.value++
  distance.value = `translateX(-${swiperIndex.value * 100}%)`
  // 遇到第最后一张，设置跳转
  if (swiperIndex.value === arrayLength + 1) {
    setTimeout(() => {
      // 设置轮播图到第一张，消除过度效果
      transition.value = 'none'
      swiperIndex.value = 1
      distance.value = `translateX(-${swiperIndex.value * 100}%)`
    }, 500)
  }

  // 清除定时器
  interTimer && clearInterval(interTimer)
  // 重开定时器
  interTimer = setInterval(() => {
    next(props.imgArray.length)
  }, +props.duration)
}

// 销毁计算器
onUnmounted(() => {
  outTimer && clearTimeout(outTimer)
  interTimer && clearInterval(interTimer)
})

// 成功加载图量
let successImgLoaded = 0
// 加载失败
let errorImgLoaded = 0
// 图片加载成功事件
const imgLoadHandler = () => {
  successImgLoaded++
  // 全部加载成功就开始轮播
  if (successImgLoaded === props.imgArray.length + 2) {
    interTimer = setInterval(() => {
      next(props.imgArray.length)
    }, +props.duration)
  }
}
// 图片加载失败事件
const imgErrorHandler = () => {
  errorImgLoaded++
  // 一张失败就开始轮播
  if (errorImgLoaded > 0) {
    interTimer = setInterval(() => {
      next(props.imgArray.length)
    }, +props.duration)
  }
}
</script>

<template>
  <div class="swiperContent" :style="{ width: mainWidth, height: mainHeight }">
    <!-- 轮播图 -->
    <div
      class="swiperItem"
      :style="{
        transform: distance,
        transition: transition
      }"
      v-for="(item, index) in jointImg"
      :key="index"
    >
      <img @load="imgLoadHandler" @error="imgErrorHandler" :src="item" alt="" />
    </div>

    <!-- 指示器 -->
    <div class="nodeBox" :style="{ width: nodeWidth }">
      <span
        v-for="(item, index) in props.imgArray"
        :key="index"
        class="node"
        :class="{ active: nodeIndex === index + 1, existNode: props.nodebox }"
      ></span>
    </div>

    <!-- 左右箭头 -->
    <van-icon
      class="pre"
      @click="pre(props.imgArray.length)"
      name="arrow-double-left"
    />
    <van-icon
      class="next"
      @click="next(props.imgArray.length)"
      name="arrow-double-right"
    />
  </div>
</template>

<style lang="less" scoped>
// 轮播图盒子
.swiperContent {
  display: flex;
  position: relative;
  overflow: hidden;
  background-color: #c1c1c1;
  .swiperItem {
    transition: all 0.5s;
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  // 指示器盒子
  .nodeBox {
    position: absolute;
    display: flex;
    justify-content: space-between;
    top: 84%;
    left: 50%;
    height: 10px;
    transform: translateX(-50%);
    .node {
      width: 10px;
      height: 10px;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 5px;
    }
    // 指示器是否显示
    .existNode {
      display: none;
    }
    // 指示器激活状态
    .active {
      background-color: #fff;
    }
  }
  // 左右箭头
  .pre,
  .next {
    position: absolute;
    color: rgba(255, 255, 255, 0.7);
    width: 24px;
    height: 24px;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  .pre {
    left: 10px;
  }
  .next {
    right: 10px;
  }
}
</style>
