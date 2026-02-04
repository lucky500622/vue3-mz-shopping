import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userSetMessageService, userGetOneMessageService } from '@/api/user'

// 用户模块
export const useUserStore = defineStore(
  'main-user',
  () => {
    // token，用jsonserver的id唯一性来模拟token
    const token = ref('')
    // 设置token
    const setToken = (newToken) => {
      token.value = newToken
    }

    // 用户信息
    const userMessage = ref('')
    // 设置用户信息
    const setUserMessage = (username) => {
      userMessage.value = username
    }

    // 姓名信息
    const userRealName = ref('')
    // 地址信息
    const userRealAddress = ref('')
    // 号码信息
    const userRealPhone = ref('')
    // 是否完善过地址信息config
    const expressConfig = ref(false)

    // 移除本地全部用户信息
    const removeLocalUserMessage = () => {
      token.value = ''
      userMessage.value = ''
      userRealName.value = ''
      userRealAddress.value = ''
      userRealPhone.value = ''
      expressConfig.value = false
    }

    // 对姓名地址号码信息设置
    const asyncSetUserRealMessage = async (address, name, phone) => {
      await userSetMessageService(token.value, address, name, phone, true)
      userRealAddress.value = address
      userRealName.value = name
      userRealPhone.value = phone
      expressConfig.value = true
    }

    // 对姓名地址号码信息获取
    const asyncGetUserRealMessage = async () => {
      const {
        data: { realaddress, realname, realphone, express }
      } = await userGetOneMessageService(token.value)
      userRealAddress.value = realaddress
      userRealName.value = realname
      userRealPhone.value = realphone
      expressConfig.value = express
    }

    return {
      token,
      setToken,
      userMessage,
      setUserMessage,
      userRealName,
      userRealAddress,
      userRealPhone,
      expressConfig,
      removeLocalUserMessage,
      asyncSetUserRealMessage,
      asyncGetUserRealMessage
    }
  },
  {
    persist: true
  }
)
