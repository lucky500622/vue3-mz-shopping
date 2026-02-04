<script setup>
import { useUserStore, useCartStore } from '@/store'
const userStore = useUserStore()
const cartStore = useCartStore()
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
import { myTologinConfirmToast } from '@/utils/my-Toast'
import { onMounted, ref } from 'vue'
const showHlepConfig = ref(false)

// 退出登录功能
const logout = () => {
  if (userStore.token === '') {
    myTologinConfirmToast('请先登录哦', '去登陆', '再逛逛', router, route)
    return
  }
  showConfirmDialog({
    title: '确认退出登录吗'
  })
    .then(() => {
      userStore.removeLocalUserMessage()
      cartStore.removeLocalCartGoods()
      showLoginConfig.value = true
    })
    .catch(() => {})
}

// 我的地址功能
const setAddress = () => {
  if (!userStore.token) {
    myTologinConfirmToast(
      '登录后才能管理地址哦',
      '去登陆',
      '再逛逛',
      router,
      route
    )
    return
  }
  router.push('/myaddress')
}

// 我的订单功能
const goMyOrder = () => {
  if (!userStore.token) {
    myTologinConfirmToast(
      '登录后才能管理订单哦',
      '去登陆',
      '再逛逛',
      router,
      route
    )
    return
  }
  router.push('/myorder')
}

// 点击修改密码业务
const toChangePassword = () => {
  if (!userStore.token) {
    myTologinConfirmToast(
      '登录后才能管理密码哦',
      '去登陆',
      '再逛逛',
      router,
      route
    )
    return
  }
  showFrom.value = true
}

import { userGetOneMessageService, userSetPasswordService } from '@/api/user'
// 修改密码下的弹窗阀
const showFrom = ref(false)
// 表单用户信息
const formName = ref('')
const formPassword = ref('')
const formNewPassword = ref()
// 校验规则
const nameValidator = (val) => {
  if (/^[\w-]{5,16}$/.test(val) && formName.value === userStore.userMessage) {
    return true
  } else return false
}
const passwordValidator = async (val) => {
  // 获取原密码
  const {
    data: { password }
  } = await userGetOneMessageService(userStore.token)
  if (/^[\w-]{8,16}$/.test(val) && formPassword.value === password) {
    return true
  } else return false
}
const confirmPasswordValidator = async (val) => {
  // 获取原密码
  const {
    data: { password }
  } = await userGetOneMessageService(userStore.token)
  if (/^[\w-]{8,16}$/.test(val) && formNewPassword.value !== password) {
    return true
  } else return false
}
import { myShowToast } from '@/utils/my-Toast'
// 修改密码表单提交
const onSubmit = async () => {
  showFrom.value = false
  await userSetPasswordService(userStore.token, formNewPassword.value)
  myShowToast('修改成功', 2000)
  formName.value = ''
  formPassword.value = ''
  formNewPassword.value = ''
}
// 关闭表单按钮
const closeForm = () => {
  showFrom.value = false
  formName.value = ''
  formPassword.value = ''
  formNewPassword.value = ''
}

import { goodsGetRandomService } from '@/api/goods'
// 商品信息
const goodsList = ref([])
// 引导登录控制变量
const showLoginConfig = ref(true)
onMounted(async () => {
  // 检查用户登录状态
  if (userStore.token) {
    showLoginConfig.value = false
  }

  // 随机值范围
  const range = 3
  // 获取随机开头索引值，startIndex[0, range - 1)
  const startIndex = Math.floor(Math.random() * range)
  // 获取商品信息
  const { data } = await goodsGetRandomService(startIndex, 10)
  goodsList.value = data
})

// 登录按钮
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      backUrl: route.fullPath
    }
  })
}

// 商品点击跳转事件
const toDetail = (e) => {
  router.push({
    name: 'ProductDetailPage',
    params: {
      id: e.currentTarget.dataset.id
    }
  })
}
</script>

<template>
  <!-- 头部个人信息模块 -->
  <div class="message">
    <div class="box">
      <div class="pic"><img src="../../assets/images/头像.png" alt="" /></div>
      <div class="name-box">
        <div class="name">{{ userStore.userMessage || '用户昵称' }}</div>
        <div class="txt">
          <van-icon color="rgb(197, 154, 70)" name="diamond" />
          普通会员
        </div>
      </div>
    </div>
  </div>

  <!-- 功能区 -->
  <div class="model">
    <div @click="goMyOrder" class="my-order">
      <van-icon size="28px" name="notes-o" />
      <p>我的订单</p>
    </div>
    <div @click="setAddress" class="my-address">
      <van-icon size="28px" name="location-o" />
      <p>我的地址</p>
    </div>
    <div @click="showHlepConfig = true" class="help">
      <van-icon size="28px" name="link-o" />
      <p>客服帮助</p>
    </div>
    <div @click="toChangePassword" class="setting">
      <van-icon size="28px" name="setting-o" />
      <p>修改密码</p>
    </div>
  </div>

  <!-- 安全设置下的弹窗 -->
  <div v-if="showFrom" class="cover">
    <div @click="closeForm" class="close-btn">取消</div>
    <van-form @submit="onSubmit" class="van-form">
      <van-cell-group inset>
        <van-field
          v-model="formName"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          autocomplete="off"
          :rules="[{ validator: nameValidator, message: '请输入原用户名' }]"
        />
        <van-field
          v-model="formPassword"
          name="原密码"
          label="原密码"
          placeholder="原密码"
          type="password"
          :rules="[{ validator: passwordValidator, message: '请输入原密码' }]"
        />
        <van-field
          v-model="formNewPassword"
          name="新密码"
          label="新密码"
          placeholder="新密码"
          type="password"
          :rules="[
            {
              validator: confirmPasswordValidator,
              message: '请输入8-16位且与原密码不同的密码'
            }
          ]"
        />
      </van-cell-group>
      <div style="margin: 2.26vw">
        <van-button round block class="btn" type="primary" native-type="submit">
          保存
        </van-button>
      </div>
    </van-form>
  </div>

  <!-- 客服邮箱 -->
  <transition name="slide">
    <div class="help-path" v-show="showHlepConfig">
      <div @click="showHlepConfig = false" class="btn">x</div>
      <div class="txt">邮箱：m18318859136@163.com</div>
    </div>
  </transition>

  <!-- 登录模块 -->
  <div @click="toLogin" class="login" v-if="showLoginConfig">点我登录</div>

  <!-- 退出登录模块 -->
  <div @click="logout" class="logout" v-if="!showLoginConfig">退出登录</div>

  <!-- 商品推荐模块 -->
  <ul class="goods-list">
    <ProductCard
      class="procard"
      @click="toDetail($event)"
      :data-id="item.id"
      v-for="item in goodsList"
      :key="item.id"
    >
      <template v-slot:proimg><img :src="item.imgUrl" alt="" /></template>
      <template v-slot:proname>{{ item.name }}</template>
      <template v-slot:proprice>{{ item.price }}</template>
    </ProductCard>
  </ul>
</template>

<style lang="less" scoped>
.message {
  height: 150px;
  background-color: rgb(195, 20, 1);
  overflow: hidden;
  box-shadow: 0 0 10px rgb(220, 220, 220);
  .box {
    display: flex;
    margin: 36px 40px;
    height: 80px;
    .pic {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .name-box {
      margin-left: 20px;
      .name {
        font-size: 19px;
        color: rgb(206, 162, 74);
        font-weight: 700;
      }
      .txt {
        margin-top: 15px;
        padding-left: 4px;
        height: 24px;
        line-height: 24px;
        width: 84px;
        background-color: rgb(60, 60, 60);
        border-radius: 5px;
        color: rgb(224, 211, 182);
        font-size: 14px;
      }
    }
  }
}

.model {
  padding: 10px 30px;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  height: 80px;
  background-color: #fff;
  div {
    padding-top: 6px;
    height: 60px;
    width: 60px;
    text-align: center;
    p {
      margin-top: 4px;
      font-size: 13px;
    }
  }
}

.help-path {
  position: fixed;
  top: 190px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  width: 260px;
  height: 110px;
  background-color: #fff;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 0 10px rgb(199, 199, 199);
  .btn {
    height: 20px;
    width: 20px;
    margin-left: 216px;
    background-color: #e9e9e9;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    color: #333333;
  }
  .txt {
    margin-top: 14px;
    text-decoration: underline;
  }
}
// 过渡效果
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from {
  transform: translate(-50%, -230px);
  opacity: 0;
}
.slide-leave-to {
  transform: translate(-50%, -230px);
  opacity: 0;
}

// 修改密码下的弹窗
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

// 登录模块
.login {
  margin: 10px;
  height: 40px;
  background-color: rgb(241, 241, 241);
  border: 1px solid rgb(186, 186, 186);
  border-radius: 10px;
  text-align: center;
  line-height: 40px;
}
// 登录模块
.logout {
  margin: 10px;
  height: 40px;
  background-color: #fff;
  border: 1px solid rgb(186, 186, 186);
  border-radius: 10px;
  text-align: center;
  line-height: 40px;
}

// 商品推荐模块
.goods-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;
  background-color: rgb(248, 249, 248);
  .procard {
    margin-bottom: 10px;
  }
}
</style>
