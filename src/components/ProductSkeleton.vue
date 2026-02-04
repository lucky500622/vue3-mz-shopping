<script setup>
const props = defineProps({
  skeleton: {
    type: Number,
    default: 10
  }
})
</script>

<template>
  <ul class="proBoxSkeleton">
    <li v-for="item in props.skeleton" :key="item">
      <div class="pic"><div class="skeleton"></div></div>
      <div class="txt"></div>
    </li>
  </ul>
</template>

<style lang="less" scoped>
.proBoxSkeleton {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  li {
    border-radius: 10px;
    overflow: hidden;
    width: 170px;
    background-color: rgba(255, 255, 255, 0.8);
    .pic {
      position: relative;
      height: 170px;
      background-color: rgba(237, 237, 237, 0.3);
      border-radius: 10px;
      overflow: hidden;
      .skeleton {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 70px;
        height: 70px;
        background-color: rgba(236, 236, 236, 0.5);
        border-radius: 50%;
        animation: cardSkeleton 5s infinite;
      }
    }
    .txt {
      height: 61px;
    }
  }
}
@keyframes cardSkeleton {
  50% {
    width: 90px;
    height: 90px;
  }
}
</style>
