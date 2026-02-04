<script setup>
import { defineEmits, computed } from 'vue'
// 定义emit事件
const emit = defineEmits(['update:addCount'])
// 定义传递值
const props = defineProps({
  addCount: {
    type: [Number]
  }
})

// 绑定数量
const goodsNum = computed(() => {
  return +props.addCount
})

// 加操作
const handleAdd = () => {
  emit('update:addCount', goodsNum.value + 1)
}
// 减操作
const handleDel = () => {
  if (goodsNum.value <= 1) return
  emit('update:addCount', goodsNum.value - 1)
}

import { myShowToast } from '@/utils/my-Toast'
// 输入错误信息重置操作
const inputSet = (e) => {
  if (isNaN(e.target.value) || e.target.value < 0) {
    // 提示错误
    myShowToast('请输入数字', 2000)
    // 重置信息
    e.target.value = 1
  }
}
// 失焦事件传递
const blurSet = (e) => {
  if (e.target.value === '' || e.target.value < 1) {
    // 提示错误
    myShowToast('请输入数字', 2000)
    // 重置信息
    e.target.value = 1
  }
  // 失焦上传信息
  emit('update:addCount', +e.target.value)
}
</script>

<template>
  <div class="main-box">
    <div class="add" @click="handleDel">-</div>
    <input
      type="text"
      @blur="blurSet($event)"
      @input="inputSet($event)"
      :value="goodsNum"
    />
    <div class="del" @click="handleAdd">+</div>
  </div>
</template>

<style lang="less" scoped>
.main-box {
  display: flex;
  text-align: center;
  height: 29px;
  background-color: #e0e0e0;
  input {
    margin: 5px 0;
    width: 36px;
    height: 20px;
    line-height: 20px;
    border: none;
    background-color: #e0e0e0;
    border-left: 1px solid rgb(179, 179, 179);
    border-right: 1px solid rgb(179, 179, 179);
    text-align: center;
  }
  .add {
    width: 30px;
    height: 29px;
    line-height: 29px;
  }
  .del {
    width: 30px;
    height: 29px;
    line-height: 29px;
  }
}
</style>
