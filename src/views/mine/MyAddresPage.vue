<script setup>
import { myShowToast } from '@/utils/my-Toast'
import { useUserStore } from '@/store'
const userStore = useUserStore()

import { ref } from 'vue'
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

// 变更信息业务
const handleChange = () => {
  showFrom.value = true
}
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
</script>

<template>
  <!-- 顶部栏 -->
  <TopBar backgroundColor="rgb(255, 255, 255)" fontColor="rgb(27, 27, 27)"
    >我的地址</TopBar
  >

  <!-- 信息栏 -->
  <ul class="message-list">
    <li class="name">姓名：{{ userStore.userRealName || '个人姓名' }}</li>
    <li class="address">地址：{{ userStore.userRealAddress || '个人地址' }}</li>
    <li class="phone">电话：{{ userStore.userRealPhone || '个人号码' }}</li>
    <button @click="handleChange">变更信息</button>
  </ul>

  <!-- 校验表单 -->
  <div v-show="showFrom" class="cover">
    <transition name="slide">
      <div class="form" v-show="showFrom">
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
            <van-button
              round
              block
              class="btn"
              type="primary"
              native-type="submit"
            >
              保存
            </van-button>
          </div>
        </van-form>
      </div>
    </transition>
  </div>
</template>

<style lang="less" scoped>
.cover {
  z-index: 999;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  .close-btn {
    margin: 108px 0 0 318px;
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

  // 过渡效果
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.5s ease;
  }
  .slide-enter-from {
    transform: translateY(230px);
    opacity: 0;
  }
  .slide-leave-to {
    transform: translateY(230px);
    opacity: 0;
  }
}

.message-list {
  margin: 50px 10px 0;
  padding: 30px 10px 0 10px;
  height: 330px;
  background-color: #ffffff;
  li {
    margin-top: 10px;
    padding: 10px 0 10px 20px;
    height: 50px;
    line-height: 30px;
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  button {
    margin-top: 30px;
    border: none;
    width: 100%;
    height: 40px;
    background-color: #f9f9f9;
    border-radius: 10px;
    border: 1px solid rgb(205, 205, 205);
  }
}
</style>
