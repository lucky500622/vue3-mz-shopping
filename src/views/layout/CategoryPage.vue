<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

// 跳转对应分类服务
const handleClick = (e) => {
  router.push({
    path: '/searchlist',
    query: {
      category: e.target.innerText
    }
  })
}
</script>

<template>
  <!-- 顶部栏 -->
  <TopBar>木子商城</TopBar>

  <!-- 分类栏 -->
  <ul>
    <li @click="handleClick($event)">日用</li>
    <li @click="handleClick($event)">水果</li>
    <li @click="handleClick($event)">鞋子</li>
    <li @click="handleClick($event)">护肤</li>
    <li @click="handleClick($event)">男装</li>
    <li @click="handleClick($event)">女装</li>
    <li @click="handleClick($event)">手机</li>
    <li @click="handleClick($event)">食品</li>
    <li @click="handleClick($event)">家具</li>
    <li @click="handleClick($event)">厨房用具</li>
    <li @click="handleClick($event)">数码产品</li>
    <li @click="handleClick($event)">家用电器</li>
  </ul>
</template>

<style lang="less" scoped>
ul {
  margin-top: 10px;
  padding: 0 10px;
  background-color: #fff;
  li {
    margin-bottom: 10px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    box-shadow: 0 10px 10px rgb(241, 241, 241);
    font-size: 20px;
    font-family: 'Songti SC', 'STSong', 'PMingLiU', serif;
    font-weight: 700;
  }
}
</style>
