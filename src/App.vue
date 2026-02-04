<script setup>
import { windowHeight } from 'vant/lib/utils'
import { provide } from 'vue'
// 获取浏览器高度，并减去底部栏高度
const winHeight = windowHeight.value
// 传递给子代
provide('winHeight', winHeight)
</script>

<template>
  <!-- 一级路由出口 -->
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" v-if="$route.meta.keepAlive"></component>
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive"></component>
  </router-view>
</template>

<style scoped></style>
