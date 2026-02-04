<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
import { useCartStore, useUserStore } from '@/store'
const cartStore = useCartStore()
const userStore = useUserStore()
import { goodsGetOneService } from '@/api/goods'

// 商品数据
const goodsList = ref([])
// 商品总价
const goodsTotalPrice = ref()
onMounted(async () => {
  // 提取购买的商品数据
  // 查看是否有from，携带即为购物车页而来
  if (route.query.from) {
    // 刷新网页会丢失pinia仓库，故判仓库是否有数据
    if (cartStore.allCartGoods.length === 0)
      // 无数据即丢失，调取异步获取
      await cartStore.asyncGetCartGoods(userStore.token)
    // 赋值给用于结算的商品数组
    goodsList.value = cartStore.isCheckedGoods
    goodsTotalPrice.value = cartStore.isCheckedTotalPrice
  } // 没有即为详情页跳转而来
  else {
    // 解构需要的属性
    const {
      data: { id, name, price, imgUrl }
    } = await goodsGetOneService(route.query.id)
    // 拼接赋值给用于结算的商品数组
    goodsList.value = [{ id, name, price, imgUrl, count: route.query.count }]
    goodsTotalPrice.value = price * route.query.count
  }

  // 获取用户的个人真实信息
  await userStore.asyncGetUserRealMessage()

  // 拼接订单编号
  code.value = Date.now() + userStore.userMessage
})

// 拼接的订单号信息
const code = ref('')

// 表单用户信息
const formName = ref('')
const formAddress = ref('')
const formPhone = ref()
// 校验规则
const nameValidator = (val) => /^(?:[\u4e00-\u9fa5·]{2,16})$/.test(val)
const addressValidator = (val) => /^.+省.+市.+$/.test(val)
const phoneValidator = (val) => /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(val)
// 信息表单呼出控制变量
const showFrom = ref(false)

// 更改表单业务
const editform = () => {
  showFrom.value = true
}
import { myShowToast } from '@/utils/my-Toast'
// 表单提交功能
const onSubmit = async () => {
  // 异步上传信息
  showFrom.value = false
  await userStore.asyncSetUserRealMessage(
    formAddress.value,
    formName.value,
    formPhone.value
  )
  myShowToast('保存成功', 2000)
}

import { orderSetService, orderGetService } from '@/api/order'
import { useRouter } from 'vue-router'
const router = useRouter()
// 支付按钮节流阀
let buyConfig = false
// 定时器
let timer = null
// 立即支付业务
const buy = async () => {
  // 节流
  if (buyConfig) return
  buyConfig = true
  timer = setTimeout(() => {
    buyConfig = false
  }, 3000)
  // 检查表单是否填写
  if (!userStore.expressConfig) {
    myShowToast('请填写订单信息', 2000)
    return
  }
  // 拼接一条新的订单信息
  const orderObj = {
    code: code.value,
    address: userStore.userRealAddress,
    name: userStore.userRealName,
    phone: userStore.userRealPhone,
    time: new Date().toLocaleString(),
    totalPrice: goodsTotalPrice.value,
    goods: goodsList.value
  }
  // 获取现有的订单信息
  const {
    data: { AllOrder }
  } = await orderGetService(userStore.token)
  const orderList = ref(AllOrder)
  // 追加订单信息
  orderList.value.unshift(orderObj)
  // 更新订单信息
  await orderSetService(userStore.token, orderList.value)
  // 更新购物车信息，删除选中的商品
  await cartStore.delCartGoods(userStore.token)
  // 跳转路由
  router.replace({
    name: 'FinalPage',
    params: {
      code: code.value
    }
  })
}

// 销毁定时器
onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <!-- 顶部栏 -->
  <TopBar backgroundColor="rgb(255, 255, 255)" fontColor="rgb(27, 27, 27)"
    >结算页</TopBar
  >

  <!-- 表单信息栏 -->
  <div class="messageForm">
    <div @click="editform" class="editform">去更改></div>
    <div class="code">
      订单编号：<span>{{ code }}</span>
    </div>
    <div class="address">
      收货地址：{{ userStore.userRealAddress || '个人地址' }}
    </div>
    <div class="bottom">
      <span class="name">姓名：{{ userStore.userRealName || '个人姓名' }}</span
      ><span class="phone"
        >手机号：{{ userStore.userRealPhone || '个人号码' }}</span
      >
    </div>
  </div>

  <!-- 校验表单 -->
  <div v-show="showFrom" class="cover">
    <div @click="showFrom = false" class="close-btn">取消</div>
    <van-form @submit="onSubmit" class="van-form">
      <van-cell-group inset>
        <van-field
          v-model="formName"
          name="姓名"
          label="姓名"
          placeholder="姓名"
          :rules="[
            { validator: nameValidator, message: '请填写正确的个人姓名' }
          ]"
        />
        <van-field
          v-model="formAddress"
          name="地址"
          label="地址"
          placeholder="地址"
          :rules="[
            { validator: addressValidator, message: '请填写xx省xx市xx地址' }
          ]"
        />
        <van-field
          v-model="formPhone"
          name="手机号"
          label="手机号"
          placeholder="手机号"
          :rules="[{ validator: phoneValidator, message: '请填写手机号' }]"
        />
      </van-cell-group>
      <div style="margin: 2.26vw">
        <van-button round block class="btn" type="primary" native-type="submit">
          保存
        </van-button>
      </div>
    </van-form>
  </div>

  <!-- 商品信息 -->
  <div class="goods-box">
    <div class="goods-card" v-for="item in goodsList" :key="item.id">
      <div class="pic"><img :src="item.imgUrl" loading="lazy" alt="" /></div>
      <div class="message">
        <div class="goods-name">{{ item.name }}</div>
        <div class="goods-price">￥{{ item.price }}</div>
        <div class="goods-count">数量：{{ item.count }}</div>
      </div>
    </div>
  </div>

  <!-- 价格明细模块 -->
  <div class="price-message">
    <div class="topbar"><h1>价格明细：</h1></div>
    <ul>
      <li class="goods-message" v-for="item in goodsList" :key="item.id">
        <div class="name">{{ item.name }}</div>
        <div class="total-price">￥{{ item.price * item.count }}</div>
      </li>
    </ul>
    <div class="bottom-bar">
      <h1>共计</h1>
      <div class="all-price">￥{{ goodsTotalPrice }}</div>
    </div>
  </div>

  <!-- 底部支付按钮 -->
  <div class="buy">
    <div @click="buy" class="btn">
      <div class="price">￥{{ goodsTotalPrice }}</div>
      <div class="txt">立即支付</div>
    </div>
  </div>
  <div class="space"></div>
</template>

<style lang="less" scoped>
.messageForm {
  margin-top: 10px;
  padding: 10px 10px 0 10px;
  width: 375px;
  height: 106px;
  background-color: rgb(255, 255, 255);
  overflow: hidden;
  * {
    font-size: 14px;
    color: rgb(44, 44, 44);
  }
  div {
    height: 14px;
    line-height: 14px;
    margin-bottom: 12px;
  }
  .editform {
    margin: 0 0 2px 290px;
    width: 80px;
    height: 14px;
    line-height: 14px;
  }
  .bottom {
    .name {
      margin-right: 12px;
    }
  }
}

.cover {
  z-index: 999;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  .close-btn {
    margin: 140px 0 0 318px;
    height: 20px;
    width: 40px;
    background-color: rgb(227, 227, 227);
    border-radius: 5px;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    color: #172017;
  }
  .van-form {
    margin-top: 10px;
    .btn {
      margin: 0 auto;
      width: 343px;
      background: #e3e3e3;
      border-radius: 5px;
      border: none;
    }
  }
}

.goods-box {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
  .goods-card {
    margin-bottom: 10px;
    display: flex;
    height: 100px;
    .pic {
      width: 100px;
      height: 100px;
      border-radius: 5px;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }
    .message {
      margin-left: 20px;
      height: 100px;
      .goods-name {
        margin-top: 4px;
        margin-bottom: 30px;
        height: 24px;
        line-height: 24px;
        font-size: 16px;
      }
      .goods-price {
        height: 20px;
        line-height: 20px;
        font-weight: 700;
        font-size: 16px;
        color: rgb(251, 123, 18);
      }
    }
  }
  .goods-card:nth-child(2n) {
    background-color: #f8f8f8;
  }
}

.price-message {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
  .topbar {
    height: 40px;
    line-height: 40px;
    h1 {
      font-size: 18px;
    }
  }
  .goods-message {
    padding-right: 10px;
    display: flex;
    justify-content: space-between;
    div {
      height: 30px;
      line-height: 30px;
    }
    .total-price {
      color: rgb(255, 115, 0);
      font-weight: 700;
    }
  }
  .goods-message:nth-of-type(2n) {
    background-color: #f8f8f8;
  }
  .bottom-bar {
    padding-right: 10px;
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    .all-price {
      color: rgb(255, 115, 0);
      font-weight: 700;
      font-size: 17px;
    }
  }
}

.buy {
  z-index: 998;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 70px;
  background: rgba(255, 255, 255, 0.8);
  .btn {
    margin: 10px auto;
    width: 90%;
    height: 50px;
    border-radius: 5px;
    text-align: center;
    background: rgb(251, 123, 18);
    overflow: hidden;
    * {
      color: #ffffff;
    }
    .price {
      margin-top: 4px;
      font-weight: 700;
      height: 24px;
      line-height: 24px;
      font-size: 19px;
    }
  }
}
.space {
  height: 70px;
}
</style>
