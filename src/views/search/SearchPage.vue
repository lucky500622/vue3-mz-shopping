<script setup>
import { myTologinConfirmToast } from '@/utils/my-Toast'
import { onMounted, onUnmounted, ref } from 'vue'
import { useUserStore } from '@/store'
const userStore = useUserStore()
import { historyGetService } from '@/api/searchHistory'
import { goodsGetService } from '@/api/goods'
// 存储搜索历史数组
const historyArray = ref([])
// 定义是否引导去登录状态
const toLogin = ref(false)

// 存储全部商品数据
const allGoodsList = ref([])
onMounted(async () => {
  // 未登录
  if (!userStore.token) {
    // 将引导去登录状态赋值，辅助v-if显示引导登录模块
    toLogin.value = true
  }
  // 已登录，获取搜索历史
  else {
    const { data } = await historyGetService()
    historyArray.value = data.find(
      (item) => item.id === userStore.token
    ).goodsName
  }
  const { data } = await goodsGetService()
  allGoodsList.value = data
})

import { useRouter } from 'vue-router'
const router = useRouter()
import { historySetService } from '@/api/searchHistory'
// 点击历史搜索的名字时触发事件
const historyNameClick = (e) => {
  // 激活删除状态下，中断触发事件
  if (deleteConfig.value) return
  // 更新历史搜索数组
  historyArray.value.splice(e.target.dataset.id, 1)
  historyArray.value.unshift(e.target.innerText)
  // 上传更新后的历史搜索数组
  historySetService(historyArray.value, userStore.token)
  // 跳转路由携带参数
  router.push({
    path: '/searchlist',
    query: { name: e.target.innerText }
  })
}

// 切换清理模块控制变量
const deleteConfig = ref(false)
// 追加/更新搜索内容函数
const addNewHistory = (searchContent) => {
  // 搜索历史不包含搜索内容
  if (historyArray.value.every((item) => item !== searchContent)) {
    // 搜索历史有八个则删除最尾，新添最新搜索历史
    if (historyArray.value.length >= 8) {
      historyArray.value.splice(7, 1)
      historyArray.value.unshift(searchContent)
    } else {
      // 直接添加到最新搜索历史
      historyArray.value.unshift(searchContent)
    }
  }
  // 搜索历史包含搜索内容
  else {
    // 删除相同项
    historyArray.value = historyArray.value.filter(
      (item) => item !== searchContent
    )
    // 添加到最新搜索历史
    historyArray.value.unshift(searchContent)
  }

  // 上传更新后的历史搜索数组
  historySetService(historyArray.value, userStore.token)
}

// 点击删除单个历史搜索
const deleteHistory = (e) => {
  historyArray.value.splice(e.target.dataset.id, 1)
  historySetService(historyArray.value, userStore.token)
}
// 点击删除全部历史搜索记录
const removeAllHistory = async () => {
  await showConfirmDialog({
    message: '清空搜索历史'
  })
    .then(() => {
      // on confirm
      historyArray.value = []
      historySetService(historyArray.value, userStore.token)
    })
    .catch(() => {
      // on cancel
    })
  deleteConfig.value = false
}
// 完成删除按钮事件
const completeDelet = () => {
  deleteConfig.value = false
}

// 回车进行搜索
const goSearch = (searchContent) => {
  // 未登录则直接跳转，不存历史记录
  if (!userStore.token) {
    router.push({
      path: '/searchlist',
      query: { name: searchContent }
    })
    return
  }
  // 登录则保存历史记录
  addNewHistory(searchContent)

  // 跳转路由携带参数
  router.push({
    path: '/searchlist',
    query: { name: searchContent }
  })
}

import { useRoute } from 'vue-router'
const route = useRoute()
// 删除历史记录事件
const removeHistory = () => {
  // 未登录，引导登录
  if (toLogin.value) {
    myTologinConfirmToast(
      '小主登录后才有个人搜索历史哦',
      '去登录',
      '再看看',
      router,
      route
    )
    return
  }
  // 已登录，执行删除业务
  deleteConfig.value = true
}

// 点击引导登录模块，跳转登录页
const toLoginPage = () => {
  myTologinConfirmToast(
    '登录存储个人搜索历史',
    '去登录',
    '再看看',
    router,
    route
  )
}

// 推荐列表显示的控制变量
const showList = ref(false)
// 推荐列表隐藏定时器
let listHideTimer = null
// 延迟隐藏推荐列表
const hideRecommendList = (config) => {
  listHideTimer = setTimeout(() => {
    showList.value = config
  }, 500)
}

// 输入防抖定时器
let inputTimer = null
// 输入内容匹配的商品对象数组
const metaGoodsArray = ref([])
// 匹配的名字数组
const metaGoodsName = ref([])
// 输入框input触发的改变事件
const inputChange = (searchContent) => {
  // 重置定时器节流
  clearTimeout(inputTimer)
  inputTimer = setTimeout(() => {
    // filter处匹配项
    metaGoodsArray.value = allGoodsList.value.filter((item) => {
      return item.name.includes(searchContent)
    })
    // 大于5取5项
    if (metaGoodsArray.value.length > 5) {
      metaGoodsName.value = metaGoodsArray.value.slice(0, 5).map((item) => {
        return item.name
      })
    } // 为零返回空数组
    else if (metaGoodsArray.value.length === 0) {
      metaGoodsName.value = []
    } // 0到5返回全部
    else
      metaGoodsName.value = metaGoodsArray.value.slice(0).map((item) => {
        return item.name
      })
    // 输入内容为空时，清除所有匹配项
    if (!searchContent) metaGoodsName.value = []
  }, 1000)
}

// 匹配项点击锁
let recommendClickConfig = false
// 搜索匹配栏点击事件
const handleRecommend = (e) => {
  if (recommendClickConfig) true
  // 点击后上锁，防止重复点击触发跳转
  recommendClickConfig = true
  // 追加历史记录
  addNewHistory(e.target.innerText)

  // 跳转路由
  router.push({
    path: '/searchlist',
    query: { name: e.target.innerText }
  })
}

// 清除定时器
onUnmounted(() => {
  if (inputTimer) clearTimeout(inputTimer)
  if (listHideTimer) clearTimeout(listHideTimer)
})
</script>

<template>
  <!-- 顶部栏 -->
  <TopBar backgroundColor="rgb(255, 255, 255)" fontColor="rgb(27, 27, 27)"
    >木子商城</TopBar
  >

  <!-- 搜索栏 -->
  <SearchBar
    :FocusNow="true"
    @search="goSearch"
    @onfocus="(config) => (showList = config)"
    @onblur="hideRecommendList"
    @oninput="inputChange"
  ></SearchBar>

  <!-- 搜索历史 -->
  <div class="history">
    <div class="text">
      <span class="txt">我的足迹</span>
      <span class="complete" v-show="deleteConfig" @click="completeDelet"
        >完成</span
      >
      <span class="delete-all" v-show="deleteConfig" @click="removeAllHistory"
        >清空历史</span
      >
      <!-- 清空历史的垃圾桶icon -->
      <span class="delete-icon" v-show="!deleteConfig" @click="removeHistory"
        ><van-icon name="delete-o"
      /></span>
    </div>
    <!-- 搜索历史名字模块 -->
    <ul class="history-box">
      <!-- 引导登录模块 -->
      <ul v-if="toLogin" class="to-login-box">
        <li class="box">小主还未登录哦</li>
        <li class="box">为保护小主隐私，登录才能有个人搜索历史</li>
        <li class="box" @click="toLoginPage">点我跳转登录吧 !</li>
      </ul>
      <!-- 历史记录 -->
      <li
        @click="historyNameClick($event)"
        v-for="(item, index) in historyArray"
        :key="index"
        :data-id="index"
        class="box"
      >
        {{ item }}
        <div
          class="delete"
          v-show="deleteConfig"
          @click="deleteHistory($event)"
          :data-id="index"
        >
          x
        </div>
      </li>
    </ul>
  </div>

  <!-- 搜索推荐列表 -->
  <ul v-show="showList" class="recommendList">
    <li
      @click="handleRecommend($event)"
      v-for="(item, index) in metaGoodsName"
      :key="index"
    >
      {{ item }}
    </li>
  </ul>
</template>

<style lang="less" scoped>
.history {
  position: relative;
  .text {
    display: flex;
    margin: 10px 0 0 20px;
    font-size: 14px;
    line-height: 20px;
    .delete-icon {
      margin-left: 244px;
    }
    .complete {
      margin-left: 130px;
      font-size: 13px;
      width: 50px;
      text-align: center;
      line-height: 20px;
      border-radius: 5px;
      background: #e0e0e0;
    }
    .delete-all {
      margin-left: 10px;
      font-size: 13px;
      width: 80px;
      text-align: center;
      line-height: 20px;
      border-radius: 5px;
      background: #e0e0e0;
    }
  }
  .history-box {
    display: flex;
    margin-top: 10px;
    padding: 10px 0;
    height: 50px;
    width: 335px;
    flex-wrap: wrap;
    .to-login-box {
      display: flex;
      flex-wrap: wrap;
    }
    .box {
      position: relative;
      margin: 0 14px 18px;
      padding: 7px 26px;
      height: 30px;
      border-radius: 16px;
      line-height: 16px;
      font-size: 13px;
      border: 1px solid rgb(221, 221, 221);
      .delete {
        position: absolute;
        top: -2px;
        right: 2px;
        font-size: 11px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        text-align: center;
        line-height: 12px;
        background: rgb(193, 193, 193);
        animation: shake 0.8s infinite;
        color: #2f2f2f;
      }
    }
  }
}
.recommendList {
  position: absolute;
  top: 106px;
  left: 30px;
  width: 315px;
  background-color: rgba(244, 241, 244);
  border-radius: 20px;
  box-shadow: 0 0 10px rgb(197, 197, 197);
  li {
    padding-left: 20px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: rgb(72, 72, 72);
  }
}

@keyframes shake {
  30%,
  50%,
  70% {
    transform: translateX(0);
  }
  40%,
  60% {
    transform: translateX(1px);
  }
}
</style>
