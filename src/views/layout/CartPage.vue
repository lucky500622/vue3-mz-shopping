<script setup>
import { onMounted, ref } from 'vue'
import { myShowToast, myTologinConfirmToast } from '@/utils/my-Toast'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { useUserStore, useCartStore } from '@/store'
const userStore = useUserStore()
const cartStore = useCartStore()

// 登录与否的控制变量
const existToken = ref(true)

onMounted(async () => {
  // 未登录，中断获取购物车数据
  if (userStore.token === '') {
    existToken.value = false
    allChecked.value = false
    // 引导登录
    myTologinConfirmToast('请先登录哦', '去登录', '再看看', router, route)
    return
  }
  // 获取购物车数据
  await cartStore.asyncGetCartGoods(userStore.token)
  // 将数据本地式全部选中
  cartStore.resetCartIsChecked()
})

// 点击图片跳转路由
const toDetail = (e) => {
  router.push(`/prodetail/${e.target.dataset.id}`)
}

// 编辑按钮控制变量
const editBtnConfig = ref(false)
// 编辑事件
const handleEdite = () => {
  // 未登录则中断编辑事件
  if (!existToken.value) {
    // 引导登录
    myTologinConfirmToast('请先登录哦', '去登录', '再看看', router, route)
    return
  }
  editBtnConfig.value = true
  // 全部取消选中
  allChecked.value = false
  changeAllChecked()
}
// 完成编辑事件
const handleComplete = () => {
  editBtnConfig.value = false
  // 全部取消选中
  allChecked.value = true
  changeAllChecked()
}

// 更新被修改的商品count
const updateCount = async (count, id) => {
  cartStore.setOneCartGoodsCount(userStore.token, id, count)
}

// 全选变量
const allChecked = ref(true)
// 小选控制全选操作
const changeChecked = () => {
  if (cartStore.allCartGoods.length === cartStore.isCheckedGoods.length) {
    allChecked.value = true
  } else allChecked.value = false
}
// 全选反选
const changeAllChecked = () => {
  cartStore.allCartGoods.forEach((item) => {
    item.isChecked = allChecked.value
  })
}

// 删除操作
const handleDelete = async () => {
  await cartStore.delCartGoods(userStore.token)
  myShowToast('成功移除商品', 2000)
}

// 结算操作
const handeCount = () => {
  // 未登录则中断结算操作
  if (!existToken.value) {
    // 引导登录
    myTologinConfirmToast(
      '请先登录才能结账哦',
      '去登录',
      '再看看',
      router,
      route
    )
    return
  }
  if (cartStore.isCheckedGoods.length === 0) {
    myShowToast('请先选择商品哦', 2000)
    return
  }
  cartStore.asyncPushCartGoods(userStore.token)
  // 跳转结算页
  router.push({
    path: '/account',
    query: {
      from: 'cart'
    }
  })
}
</script>

<template>
  <!-- 顶部栏 -->
  <TopBar backgroundColor="rgb(255, 255, 255)" fontColor="rgb(27, 27, 27)"
    >购物车</TopBar
  >

  <!-- 商品栏Top -->
  <div class="goodsBar">
    <div class="goods-total">
      <span class="txt">已选商品</span>
      <span class="count">{{ cartStore.isCheckedTotalCount }}</span> 件
    </div>
    <div @click="handleEdite" v-show="!editBtnConfig" class="edit">
      编辑 <van-icon name="edit" />
    </div>
    <div @click="handleComplete" v-show="editBtnConfig" class="edit">
      完成 <van-icon name="edit" />
    </div>
  </div>

  <!-- 商品主盒子 -->
  <div class="goods-box">
    <div class="holder" v-if="cartStore.allCartGoods.length === 0">
      购物车竟然是空的，小主先去选购吧
    </div>
    <ul>
      <!-- 商品卡片 -->
      <li
        class="goods-card"
        v-for="item in cartStore.allCartGoods"
        :key="item.id"
      >
        <!-- 选中框 -->
        <input
          type="checkbox"
          @change="changeChecked"
          v-model="item.isChecked"
        />
        <!-- 图片 -->
        <div class="pic">
          <img
            :data-id="item.id"
            @click="toDetail($event)"
            :src="item.imgUrl"
            alt=""
            loading="lazy"
          />
        </div>
        <!-- 右侧内容 -->
        <div class="right">
          <div class="name">{{ item.name }}</div>
          <!-- 右侧底部 -->
          <div class="right-bottom">
            <div class="price">
              ￥<span>{{ item.price }}</span>
            </div>
            <!-- 算术器 -->
            <NumCounter
              class="counter"
              @update:addCount="(count) => updateCount(count, item.id)"
              :addCount="item.count"
              :data-id="item.id"
            ></NumCounter>
          </div>
        </div>
      </li>
    </ul>
  </div>

  <!-- 结算栏 -->
  <div class="counter-bar">
    <!-- 选中框 -->
    <input
      @change="changeAllChecked"
      v-model="allChecked"
      type="checkbox"
    />全选
    <!-- 总价 -->
    <div class="totalPrice" v-show="!editBtnConfig">
      ￥{{ cartStore.isCheckedTotalPrice }}
    </div>
    <!-- 结算按钮 -->
    <div @click="handeCount" v-show="!editBtnConfig" class="count-btn">
      结算
    </div>
    <div @click="handleDelete" v-show="editBtnConfig" class="count-btn-delete">
      删除
    </div>
  </div>
  <!-- 结算栏占位块 -->
  <div class="space"></div>
</template>

<style lang="less" scoped>
.goodsBar {
  display: flex;
  margin: 10px 10px;
  padding: 10px;
  justify-content: space-between;
  height: 50px;
  background-color: rgb(255, 255, 255);
  .goods-total {
    height: 30px;
    line-height: 30px;
    .count {
      margin-left: 4px;
      color: rgb(255, 54, 41);
    }
  }
  .edit {
    height: 30px;
    line-height: 30px;
  }
}

.goods-box {
  margin: 10px;
  .holder {
    height: 130px;
    background-color: #fff;
    overflow: hidden;
    text-align: center;
    line-height: 130px;
    color: rgb(90, 90, 90);
  }
  .goods-card {
    display: flex;
    height: 130px;
    background-color: #fff;
    input {
      margin: auto 14px;
      width: 16px;
      height: 16px;
    }
    .pic {
      margin-top: 10px;
      width: 110px;
      height: 110px;
      border-radius: 5px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .right {
      margin-left: 10px;
      flex: 1;
      .name {
        margin: 10px 0 0 0;
        height: 50px;
        width: 100%;
      }
      .right-bottom {
        display: flex;
        .price {
          margin-top: 10px;
          width: 90px;
          line-height: 18px;
          color: rgb(255, 41, 41);
          span {
            color: inherit;
            font-size: 18px;
            word-break: break-all;
          }
        }
        .counter {
          margin-top: 10px;
        }
      }
    }
  }
}

.counter-bar {
  display: flex;
  position: fixed;
  bottom: 60px;
  height: 56px;
  background-color: rgb(255, 255, 255);
  width: 100%;
  line-height: 56px;
  font-size: 14px;
  box-shadow: 0 0 10px rgb(229, 229, 229);
  input {
    margin: auto 4px auto 24px;
    width: 16px;
    height: 16px;
  }
  .totalPrice {
    margin-right: 10px;
    flex: 1;
    color: rgb(254, 86, 48);
    font-size: 19px;
    font-weight: 700;
    text-align: right;
  }
  .count-btn {
    margin: auto 10px auto 0;
    width: 100px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    border-radius: 5px;
    background-color: rgb(254, 86, 48);
    color: #fff;
  }
  .count-btn-delete {
    margin: auto 10px auto 193px;
    width: 100px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    border-radius: 5px;
    background-color: rgb(255, 169, 0);
    color: #fff;
  }
}
.space {
  height: 56px;
}
</style>
