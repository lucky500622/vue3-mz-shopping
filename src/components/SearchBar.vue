<script setup>
import { defineProps, nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  isFixed: {
    type: Boolean,
    default: false
  },
  existblock: {
    type: Boolean,
    default: true
  },
  FocusNow: {
    type: Boolean,
    default: false
  }
})
const existblockDefault = ref(false)
// 开启position：fixed，就设置占位块
if (props.isFixed === true) {
  existblockDefault.value = true
  if (props.existblock === false) {
    existblockDefault.value = false
  }
}

const inputBar = ref(null)
onMounted(() => {
  if (props.FocusNow) {
    // 进入页面立即聚焦input
    nextTick(() => {
      inputBar.value.focus()
    })
  }
})

const emit = defineEmits(['search', 'onfocus', 'onblur', 'oninput'])
// 搜索框动态样式
const boxShadow = ref('')
// 搜索内容
const searchContent = ref('')
// 传递回车事件
const goSearch = () => {
  // 有搜索内容，则向父组件传递搜索内容
  searchContent.value = searchContent.value.trim()
  if (!searchContent.value) return
  emit('search', searchContent.value)
}
// 传递聚焦事件
const inputFocus = () => {
  boxShadow.value = '0 0 10px rgb(210, 210, 210)'
  emit('onfocus', true)
}
// 传递失焦事件
const inputBlur = () => {
  boxShadow.value = ''
  emit('onblur', false)
}
// 传递变更事件
const inputChange = () => {
  emit('oninput', searchContent.value)
}
</script>

<template>
  <div class="box">
    <!-- 搜索层 -->
    <div class="main-bg" :class="{ isfixed: props.isFixed }">
      <!-- 搜索框 -->
      <div class="search-box" :style="{ boxShadow: boxShadow }">
        <span><van-icon name="search" /></span>
        <input
          v-model="searchContent"
          type="text"
          placeholder="请输入搜索的商品内容"
          @keyup.enter="goSearch"
          @focus="inputFocus"
          @blur="inputBlur"
          @input="inputChange"
          ref="inputBar"
        />
      </div>
    </div>
    <div class="placeholder" v-if="existblockDefault"></div>
  </div>
</template>

<style lang="less" scoped>
.main-bg {
  z-index: 998;
  width: 375px;
  height: 55px;
  overflow: hidden;
  background-color: #fff;
  .search-box {
    position: relative;
    margin: 10px 10px 5px 10px;
    width: 355px;
    height: 40px;
    border-radius: 20px;
    background-color: rgb(244, 241, 244);
    transition: all 0.5s;
    i {
      color: rgb(25, 25, 25);
    }
    span {
      position: absolute;
      left: 38px;
      top: 12px;
    }
    input {
      margin: 10px 57px 5px;
      height: 20px;
      width: 261px;
      border: none;
      background-color: inherit;
      font-size: 14px;
    }
  }
}
.isfixed {
  position: fixed;
}
.placeholder {
  height: 55px;
}
</style>
