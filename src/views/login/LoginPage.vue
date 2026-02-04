<script setup>
import { ref } from 'vue'
import { myShowToast } from '@/utils/my-Toast'
import { useRouter } from 'vue-router'
const router = useRouter()
import { useRoute } from 'vue-router'
const route = useRoute()

// 切换登录/注册的控制变量
const changeWayConfig = ref(false)

// 动态style
const gap = ref('10px')
const marginBottom = ref('0')
// 动态改变input信息框/h1标题的style
if (!changeWayConfig.value) {
  gap.value = '20px'
  marginBottom.value = '50px'
}

// 去登录或注册切换
const changeWay = () => {
  closeToast()
  changeWayConfig.value = !changeWayConfig.value
}

// input信息框value
const username = ref('')
const password = ref('')
const repassword = ref('')

// input信息校验
// active控制
const UsernameActive = ref(false)
const PasswordActive = ref(false)
const RepasswordActive = ref(false)
// 校验结果
const isValiUsername = ref(false)
const isValiPassword = ref(false)
const isValiRepassword = ref(false)
const isAgree = ref(false)

// 用户名校验
const usernameTest = () => {
  if (!/^[\w-]{5,16}$/.test(username.value)) {
    UsernameActive.value = true
  } else {
    UsernameActive.value = false
    isValiUsername.value = true
  }
}
// 密码校验
const passwordTest = () => {
  if (!/^[\w-]{8,16}$/.test(password.value)) {
    PasswordActive.value = true
  } else {
    PasswordActive.value = false
    isValiPassword.value = true
  }
}
// 确认密码校验
const rePasswordTest = () => {
  if (
    !/^[\w-]{8,16}$/.test(repassword.value) ||
    password.value !== repassword.value
  ) {
    RepasswordActive.value = true
  } else {
    RepasswordActive.value = false
    isValiRepassword.value = true
  }
}

import { userGetMessageService } from '@/api/user.js'
import { userRegisterService } from '@/api/user.js'
import { useUserStore } from '@/store'

// 注册提交事件
const register = async (un, pw) => {
  // 校验表单
  if (
    isValiUsername.value &&
    isValiPassword &&
    isValiRepassword &&
    isAgree.value
  ) {
    // 检测是否注册过当前用户名
    const { data } = await userGetMessageService()
    if (data.every((item) => item.username !== username.value)) {
      // 上传注册信息
      await userRegisterService(un, pw)
      myShowToast('注册成功', 1000)
      changeWayConfig.value = !changeWayConfig.value
    } else myShowToast('用户名已被使用过', 1000)
  } else {
    // 验证不通过则提示
    myShowToast('请检查注册信息及同意用户协议', 3000)
  }
}

import { historyInitService } from '@/api/searchHistory'
import { cartInitService } from '@/api/cart'
import { userInitMessageService, userGetOneMessageService } from '@/api/user'
import { orderInitService } from '@/api/order'
// 登录提交事件
const userStore = useUserStore()
const login = async () => {
  // 确认信息是否有误
  if (isValiUsername.value && isValiPassword.value) {
    // 获取注册过的用户信息
    const { data } = await userGetMessageService()
    // 比对当前键入的信息，确认用户信息
    const mate = data.find(
      (item) =>
        item.username === username.value && item.password === password.value
    )
    if (!mate) {
      myShowToast('填写信息有误', 3000)
      return
    }
    // 存储用户信息以及token到pinia管理并持久化
    userStore.setUserMessage(username.value)
    userStore.setToken(mate.id)
    myShowToast('登录成功', 1000)

    // 获取用户初始化信息
    const {
      data: { init }
    } = await userGetOneMessageService(userStore.token)
    // 对未初始化的用户，进行初始化
    if (!init) {
      // 添加true到user的初始化记录信息
      userInitMessageService(userStore.token)
      // 初始化历史搜索
      historyInitService(userStore.token)
      // 初始化购物车
      cartInitService(userStore.token)
      // 初始化订单仓库
      orderInitService(userStore.token)
    }

    // 判断是否有回跳地址
    const url = route.query.backUrl || '/'
    // 正常业务，跳转到首页
    router.replace(`${url}`)
  } else myShowToast('填写信息有误', 3000)
}

import { watch } from 'vue'
// 切换为登录/注册重置
watch(changeWayConfig, () => {
  // 表单重置
  username.value = ''
  password.value = ''
  repassword.value = ''
  // active动态添加的类重置
  UsernameActive.value = false
  PasswordActive.value = false
  RepasswordActive.value = false
  // 校验结果重置
  isValiUsername.value = false
  isValiPassword.value = false
  isValiRepassword.value = false
  isAgree.value = false
})
</script>

<template>
  <!-- 注册模块 -->
  <div v-if="changeWayConfig" class="mianBox">
    <h1>注册用户</h1>
    <!-- input信息框 -->
    <div class="message">
      <div class="box">
        <p>
          用户名
          <span :class="{ active: UsernameActive }">请输入5-16位的用户名</span>
        </p>
        <input @blur="usernameTest" v-model="username" type="text" />
      </div>
      <div class="box">
        <p>
          密码
          <span :class="{ active: PasswordActive }">请输入8-16位的密码</span>
        </p>
        <input @blur="passwordTest" v-model="password" type="password" />
      </div>
      <div class="box">
        <p>
          确认密码
          <span :class="{ active: RepasswordActive }">
            请确保输入的密码相同</span
          >
        </p>
        <input @blur="rePasswordTest" v-model="repassword" type="password" />
      </div>
    </div>
    <!-- 用户协议确认复选框 -->
    <div class="confirm">
      <input class="confirmBox" v-model="isAgree" type="checkbox" />
      <div class="confirmText">
        我已同意<a href="javascript:void(0)">《用户协议》</a>
      </div>
    </div>
    <!-- 注册按钮 -->
    <div class="btn" @click="register(username, password)">注册</div>
    <!-- 登录/注册切换 -->
    <div class="changeWay" @click="changeWay">已有账号？点击登录</div>
  </div>

  <!-- 登录模块 -->
  <div v-else class="mianBox">
    <h1 :style="{ marginBottom: marginBottom }">登录账号</h1>
    <!-- input信息框 -->
    <div :style="{ gap: gap }" class="message">
      <div class="box">
        <p>
          用户名<span :class="{ active: UsernameActive }"
            >请输入5-16位的用户名</span
          >
        </p>
        <input @blur="usernameTest" v-model="username" type="text" />
      </div>
      <div class="box">
        <p>
          密码<span :class="{ active: PasswordActive }"
            >请输入8-16位的密码</span
          >
        </p>
        <input @blur="passwordTest" v-model="password" type="password" />
      </div>
    </div>
    <!-- 登录按钮 -->
    <div @click="login" class="btn">登录</div>
    <!-- 登录/注册切换 -->
    <div class="changeWay" @click="changeWay">还没有账号？点击注册</div>
  </div>
</template>

<style lang="less" scoped>
.mianBox {
  height: 500px;
  h1 {
    margin: 70px 0 30px 30px;
    font-size: 30px;
  }
  // input信息框
  .message {
    display: grid;
    gap: 10px;
    .box {
      margin: 0 30px;
      p {
        margin-bottom: 10px;
        font-size: 14px;
        span {
          display: none;
          margin-left: 10px;
          font-size: 11px;
          color: rgb(255, 72, 72);
        }
        .active {
          display: inline;
        }
      }
      input {
        padding: 0 10px;
        height: 50px;
        width: 100%;
        background-color: rgba(237, 238, 238, 0.8);
        border: none;
        border-radius: 5px;
        font-size: 16px;
      }
    }
  }
  // 用户协议确认复选框
  .confirm {
    display: flex;
    margin: 20px 0 0 30px;
    height: 20px;
    .confirmBox {
      margin: 3px 0;
      height: 14px;
      width: 14px;
    }
    .confirmText {
      margin: 0 0 10px 20px;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      a {
        font-size: 14px;
      }
    }
  }
  // 登录/注册按钮
  .btn {
    margin: 50px 30px;
    height: 50px;
    width: 315px;
    border-radius: 5px;
    background-color: rgba(211, 232, 232, 0.4);
    line-height: 50px;
    text-align: center;
    color: rgb(27, 27, 27);
  }
  .changeWay {
    margin: 0 30px;
    text-align: center;
    font-size: 15px;
  }
}
</style>
