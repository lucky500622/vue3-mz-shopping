import request from '@/utils/request'

// 提交当前用户注册信息
export const userRegisterService = (username, password) => {
  return request.post('/user', {
    username,
    password,
    realaddress: '',
    realname: '',
    realphone: '',
    init: false,
    express: false
  })
}

// 获取全部用户信息
export const userGetMessageService = () => {
  return request.get('/user')
}

// 更新初始化信息到用户信息里
export const userInitMessageService = (id) => {
  return request.patch(`/user/${id}`, {
    init: true
  })
}

// 获取某个用户的信息
export const userGetOneMessageService = (id) => {
  return request.get(`/user/${id}`)
}

// 修改某个用户的密码
export const userSetPasswordService = (id, password) => {
  return request.patch(`/user/${id}`, {
    password
  })
}

// 更新个人收货信息
export const userSetMessageService = (id, address, name, phone, express) => {
  return request.patch(`/user/${id}`, {
    realaddress: address,
    realname: name,
    realphone: phone,
    express
  })
}
