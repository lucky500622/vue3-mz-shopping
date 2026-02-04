<script setup>
import BottomBar from '@/components/BottomBar.vue'
import { nextTick, onActivated, ref } from 'vue'

// 首页路由切换时会缓存本组件，为重置底部栏组件绑定一个控制变量
const showChild = ref(true)
// 在本组件为缓存状态时，执行以下代码
onActivated(() => {
  // 销毁底部栏
  showChild.value = false
  // 成功销毁会触发DOM更新
  nextTick(() => {
    // 渲染底部栏，完成重置
    showChild.value = true
  })
})
</script>
<template>
  <!-- 二级路由出口 -->
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" v-if="$route.meta.keepAlive"></component>
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive"></component>
  </router-view>
  <!-- 底部栏组件 -->
  <BottomBar
    v-if="showChild"
    oneRouterGo="/layout/home"
    twoRouterGo="/layout/category"
    threeRouterGo="/layout/cart"
    fourRouterGo="/layout/mine"
    :existSpace="true"
  ></BottomBar>
</template>

<style lang="less" scoped></style>
