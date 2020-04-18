import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/base/user/auth/login/admin ',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/base/user/auth/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/mall/admin/auth/info',
    method: 'get',
    params: { token }
  })
}

